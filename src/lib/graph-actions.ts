'use server';

import sql from './db';
import { KGNode, KGLink, NeighborResult, NodeDetail } from './types';

/**
 * Server Action to fetch a node and its neighbors.
 */
export async function fetchNeighbors(nodeId: string): Promise<NeighborResult> {
  try {
    // 1. Fetch center node and edges in parallel
    const [centerNodes, edges] = await Promise.all([
      sql`SELECT id, label, class FROM kg_nodes WHERE id = ${nodeId}`,
      sql`SELECT source_id as source, target_id as target, label FROM kg_edges WHERE source_id = ${nodeId} OR target_id = ${nodeId}`
    ]) as [any[], KGLink[]];

    const centerNode = centerNodes[0];

    const neighborIds = new Set<string>();
    edges.forEach(e => {
      neighborIds.add(e.source);
      neighborIds.add(e.target);
    });
    neighborIds.delete(nodeId);

    let neighborNodes: KGNode[] = [];
    if (neighborIds.size > 0) {
      neighborNodes = await sql`
        SELECT id, label, class FROM kg_nodes WHERE id = ANY(${Array.from(neighborIds)})
      ` as KGNode[];
    }

    return {
      nodes: [centerNode as KGNode, ...neighborNodes],
      links: edges
    };
  } catch (error) {
    console.error('Database Error (fetchNeighbors):', error);
    return { nodes: [], links: [] };
  }
}

/**
 * Server Action for global search.
 */
export async function searchNodes(query: string): Promise<KGNode[]> {
  const q = `%${query.toLowerCase().trim()}%`;
  try {
    return await sql`
      SELECT id, label, class 
      FROM kg_nodes 
      WHERE LOWER(label) LIKE ${q} OR LOWER(id) LIKE ${q}
      LIMIT 10
    ` as KGNode[];
  } catch (error) {
    console.error('Database Error (searchNodes):', error);
    return [];
  }
}

/**
 * Server Action for dashboard stats.
 */
export async function getGraphStats() {
  try {
    const [[{ count: nodeCount }], [{ count: edgeCount }]] = await Promise.all([
      sql`SELECT count(*) FROM kg_nodes`,
      sql`SELECT count(*) FROM kg_edges`
    ]) as [any[], any[]];
    
    return { 
      nodeCount: parseInt(nodeCount), 
      edgeCount: parseInt(edgeCount) 
    };
  } catch (error) {
    return { nodeCount: 0, edgeCount: 0 };
  }
}

import redis from './redis';

/**
 * Server Action for detailed node metadata.
 */
export async function fetchNodeDetail(nodeId: string): Promise<NodeDetail | null> {
  try {
    const [node] = await sql`
      SELECT * FROM kg_nodes WHERE id = ${nodeId}
    ` as any[];

    if (!node) return null;

    const systemNodes = ['idx', 'arc', 'gph', 'inf', 'kws'];
    let telemetry = [
      { label: 'Semantic_Weight', value: (Math.random() * 0.9 + 0.1).toFixed(3) },
      { label: 'Global_Rank', value: `#${Math.floor(Math.random() * 1000)}` },
      { label: 'Registry_Date', value: new Date(node.created_at).toLocaleDateString() },
    ];

    // If it's a system node, pull real-time data from Redis
    const sid = nodeId.toLowerCase();
    if (systemNodes.includes(sid)) {
      const pipeline = redis.pipeline();
      pipeline.get(`pulse:${sid}`);
      pipeline.lrange(`pulse:${sid}:history`, 0, 0);
      
      const results = await pipeline.exec();
      
      let pulse: string | null = null;
      let history: string[] = [];

      if (results) {
        pulse = results[0][1] as string;
        history = results[1][1] as string[];
      }
      
      const now = Date.now();
      const isOnline = pulse && (now - parseInt(pulse)) < 60000;

      telemetry = [
        { label: 'Live_Status', value: isOnline ? '🟢 ONLINE' : '🔴 OFFLINE' },
        { label: 'Response_Time', value: isOnline && history[0] ? `${history[0]}ms` : '---' },
        { label: 'Last_Handshake', value: pulse ? `${Math.floor((now - parseInt(pulse)) / 1000)}s ago` : 'NEVER' },
        { label: 'System_ID', value: sid.toUpperCase() },
      ];
    } else {
      telemetry.push({ label: 'Status', value: 'INDEXED' });
    }

    return {
      id: node.id,
      label: node.label,
      class: node.class,
      description: node.description || `Semantic core for ${node.label}. Indexed in the Chaipat Systems Ontology.`,
      telemetry
    };
  } catch (error) {
    console.error('fetchNodeDetail Error:', error);
    return null;
  }
}

export async function getNodeById(id: string): Promise<KGNode | null> {
  try {
    const [node] = await sql`SELECT id, label, class FROM kg_nodes WHERE id = ${id}` as KGNode[];
    return node || null;
  } catch (error) {
    return null;
  }
}

export async function getParentInfo(id: string) {
  try {
    const [edge] = await sql`
      SELECT source_id, label FROM kg_edges WHERE target_id = ${id} LIMIT 1
    ` as any[];
    if (!edge) return null;
    const node = await getNodeById(edge.source_id);
    return { node, link: { source: edge.source_id, target: id, label: edge.label } };
  } catch (error) {
    return null;
  }
}
