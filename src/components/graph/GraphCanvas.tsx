/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Focus, Minimize2, ScanEye } from 'lucide-react';
import { NodeClass, fetchNeighbors, fetchNodeDetail, getNodeById, getParentInfo, NodeDetail, ROOT_NODE } from '@/lib/graph-mock-api';
import GraphInspector from './GraphInspector';
import { InteractionMode } from './GraphToolbox';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

// -----------------------------------------------------------------
// Scientific Paper / Monotone Palette
// -----------------------------------------------------------------
const PALETTE: Record<NodeClass | 'default', string> = {
  root: '#1A1A1A', // Deepest Black
  domain: '#A39382', // Desaturated Earth Tone (Taupe)
  system: '#757575', // Mid-tone Grey
  validation: '#FFFFFF', // Hollow (White fill, Black stroke)
  tech: '#9E9E9E', // Secondary Grey
  default: '#F5F5F0', // Parchment
};
const LINK_COLOR = 'rgba(0,0,0,0.12)';
const LABEL_HALO = 'rgba(245, 245, 240, 0.8)';
const FONT_FAMILY = 'Inter, Helvetica, Arial, sans-serif';

interface GraphCanvasProps {
  forcedRootId?: string;
  globalMode?: InteractionMode;
  gridSize?: number;
  onToggleFull?: () => void;
  isFull?: boolean;
  showRulers?: boolean;
  showLegend?: boolean;
  resetCounter?: number;
  isPreview?: boolean;
}

export default function GraphCanvas({
  forcedRootId,
  globalMode = 'explore',
  gridSize = 1,
  onToggleFull,
  isFull = false,
  showRulers = true,
  showLegend = false,
  resetCounter = 0,
  isPreview = false,
}: GraphCanvasProps) {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // DIRECT DOM REFS FOR RULERS
  const hRulerRef = useRef<HTMLDivElement>(null);
  const vRulerRef = useRef<HTMLDivElement>(null);

  const [dim, setDim] = useState({ width: 800, height: 600 });
  const hasInitialZoomed = useRef(false);

  const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [detail, setDetail] = useState<NodeDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<any>(null);

  const [currentRootId, setCurrentRootId] = useState<string>(forcedRootId || ROOT_NODE.id);
  const [trueStartId, setTrueStartId] = useState<string>(forcedRootId || ROOT_NODE.id);
  const [filterClass, setFilterClass] = useState<NodeClass | null>(null);

  // DENSITY-AWARE SCALING ENGINE
  const metrics = useMemo(() => {
    const nodeCount = graphData.nodes.length || 1;
    const density = Math.max(0, (nodeCount - 5) / 15);

    // BUMPED RADIUS BY ~25%
    let r = gridSize === 1 ? 20 : gridSize === 2 ? 16 : 13;
    r = r / (1 + density * 0.3);

    let dist = gridSize === 1 ? 180 : gridSize === 2 ? 130 : 90;
    dist = dist / (1 + density * 0.2);

    let pad = gridSize === 1 ? 150 : gridSize === 2 ? 100 : 60;
    pad = pad * (1 + density * 0.25);

    let ch = gridSize === 1 ? -450 : gridSize === 2 ? -350 : -250;
    ch = ch * (1 + density * 0.5);

    return { radius: r, distance: dist, padding: pad, charge: ch };
  }, [gridSize, graphData.nodes.length]);

  const maxZoomLevel = useMemo(() => {
    if (gridSize === 1) return 1.8;
    if (gridSize === 2) return 2.2;
    return 3.5;
  }, [gridSize]);

  const nodePool = useRef<Map<string, any>>(new Map());
  const linkPool = useRef<Map<string, any>>(new Map());
  const childMap = useRef<Map<string, string[]>>(new Map());

  // Sync with prop
  useEffect(() => {
    if (forcedRootId && forcedRootId !== currentRootId) {
      setCurrentRootId(forcedRootId);
      hasInitialZoomed.current = false;
    }
  }, [forcedRootId, currentRootId]);

  const updateVisibleGraph = useCallback(() => {
    const visibleIds = new Set<string>();
    const q = [trueStartId];
    visibleIds.add(trueStartId);
    while (q.length) {
      const curId = q.shift()!;
      const node = nodePool.current.get(curId);
      if (node?.expanded) {
        const children = childMap.current.get(curId) || [];
        children.forEach(cid => { if (!visibleIds.has(cid)) { visibleIds.add(cid); q.push(cid); } });
      }
    }
    const vNodes = Array.from(nodePool.current.values()).filter(n => visibleIds.has(n.id));
    const vLinks = Array.from(linkPool.current.values()).filter(l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      return visibleIds.has(sid) && visibleIds.has(tid);
    });
    setGraphData({ nodes: vNodes, links: vLinks });
  }, [trueStartId]);

  useEffect(() => {
    async function init() {
      nodePool.current.clear();
      linkPool.current.clear();
      childMap.current.clear();
      setSelectedId(null);
      setDetail(null);

      const nodeInfo = await getNodeById(currentRootId);
      const targetNode = {
        ...(nodeInfo || ROOT_NODE),
        id: currentRootId,
        expanded: false,
        loading: false,
        isLeaf: false,
        x: 0, y: 0
      };

      nodePool.current.set(targetNode.id, targetNode);
      setTrueStartId(targetNode.id);

      try {
        const res = await fetchNeighbors(targetNode.id);
        if (res.nodes.length > 0) {
          // STRICT FILTER: Only show nodes that are direct targets of the root
          const directChildIds = new Set(res.links.filter(l => l.source === targetNode.id).map(l => l.target));
          
          res.nodes.forEach(n => {
            if (!nodePool.current.has(n.id)) {
              nodePool.current.set(n.id, { 
                ...n, 
                expanded: false, 
                loading: false, 
                x: (Math.random() - 0.5) * 500, 
                y: (Math.random() - 0.5) * 500 
              });
            }
          });
          res.links.forEach(l => {
            const lid = `${l.source}-${l.target}`;
            if (!linkPool.current.has(lid)) { linkPool.current.set(lid, { ...l }); }
          });
          
          // Map only direct children to the root
          childMap.current.set(targetNode.id, Array.from(directChildIds));
        } else {
          targetNode.isLeaf = true;
        }
      } catch (e) { }

      updateVisibleGraph();
      
      // FOCAL CENTER: Anchor root to center
      setTimeout(() => {
        if (fgRef.current) {
          fgRef.current.centerAt(0, 0, 800);
          fgRef.current.zoom(1.2, 800);
        }
      }, 200);
    }
    init();
  }, [currentRootId, updateVisibleGraph]);

  // Adaptive initial zoom fit
  useEffect(() => {
    if (graphData.nodes.length > 0 && !hasInitialZoomed.current && fgRef.current) {
      hasInitialZoomed.current = true;
      setTimeout(() => {
        fgRef.current.zoomToFit(800, metrics.padding);
      }, 500);
    }
  }, [graphData.nodes.length, metrics.padding]);

  const cursorStyle = useMemo(() => {
    if (!hoveredNode) return 'grab';
    if (globalMode === 'view') return 'pointer';
    if (globalMode === 'explore') return 'pointer';
    if (globalMode === 'inspect') return 'help';
    return 'pointer';
  }, [hoveredNode, globalMode]);

  useEffect(() => {
    const canvas = containerRef.current?.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) { canvas.style.cursor = cursorStyle; }
  }, [cursorStyle]);

  const { highlightNodes, highlightLinks } = useMemo(() => {
    const hNodes = new Set<string>();
    const hLinks = new Set<any>();

    // IF WE HAVE A CLASS FILTER
    if (filterClass) {
      graphData.nodes.forEach(n => { if (n.class === filterClass) hNodes.add(n.id); });
      return { highlightNodes: hNodes, highlightLinks: hLinks };
    }

    const activeId = (globalMode === 'view' && hoveredNode) ? hoveredNode.id : selectedId;
    if (!activeId) return { highlightNodes: hNodes, highlightLinks: hLinks };
    hNodes.add(activeId);
    const children = childMap.current.get(activeId) || [];
    children.forEach(cid => hNodes.add(cid));
    const q = [activeId];
    const visited = new Set<string>();
    while (q.length) {
      const curId = q.shift()!;
      if (visited.has(curId)) continue;
      visited.add(curId);
      graphData.links.forEach(l => {
        const sid = typeof l.source === 'object' ? l.source.id : l.source;
        const tid = typeof l.target === 'object' ? l.target.id : l.target;
        if (tid === curId) { hNodes.add(sid); hLinks.add(l); q.push(sid); }
      });
    }
    graphData.links.forEach(l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      if (sid === activeId && children.includes(tid)) { hLinks.add(l); }
    });
    return { highlightNodes: hNodes, highlightLinks: hLinks };
  }, [selectedId, hoveredNode, globalMode, graphData.links, graphData.nodes, filterClass]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setDim({ width: e.contentRect.width, height: e.contentRect.height }));
    ro.observe(el);
    setDim({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // ADAPTIVE SIMULATION ENGINE
  useEffect(() => {
    const t = setTimeout(() => {
      if (!fgRef.current) return;
      fgRef.current.d3Force('charge')?.strength(metrics.charge).distanceMax(800);
      fgRef.current.d3Force('link')?.distance(metrics.distance).strength(1);
      fgRef.current.d3Force('center')?.strength(0.02);
    }, 100);
    return () => clearTimeout(t);
  }, [metrics]);

  const handleNodeClick = useCallback(async (node: any) => {
    if (globalMode === 'view') return;
    if (globalMode === 'inspect') {
      setSelectedId(node.id);
      setLoadingDetail(true);
      setDetail(null);
      fetchNodeDetail(node.id).then(res => { setDetail(res); setLoadingDetail(false); }).catch(() => setLoadingDetail(false));
      return;
    }
    if (globalMode === 'explore') {
      if (node.loading) return;
      if (node.expanded) {
        node.expanded = false;
        const q = [node.id];
        while (q.length) {
          const curId = q.shift()!;
          const children = childMap.current.get(curId) || [];
          children.forEach(cid => { const childNode = nodePool.current.get(cid); if (childNode) { childNode.expanded = false; q.push(cid); } });
        }
        updateVisibleGraph();
        setTimeout(() => fgRef.current?.zoomToFit(500, metrics.padding), 300);
      } else {
        node.loading = true;
        updateVisibleGraph();
        try {
          const res = await fetchNeighbors(node.id);
          node.loading = false;
          if (res.nodes.length === 0) { node.isLeaf = true; }
          else {
            node.expanded = true;
            const px = node.x ?? 0, py = node.y ?? 0;
            
            // STRICT FILTER: Only show nodes that are direct targets of the expanded node
            const directChildIds = new Set(res.links.filter(l => l.source === node.id).map(l => l.target));
            
            res.nodes.forEach(n => {
              if (!nodePool.current.has(n.id)) {
                nodePool.current.set(n.id, { 
                  ...n, 
                  expanded: false, 
                  loading: false, 
                  x: px + (Math.random() - 0.5) * 50, 
                  y: py + (Math.random() - 0.5) * 50 
                });
              }
            });
            res.links.forEach(l => {
              const lid = `${l.source}-${l.target}`;
              if (!linkPool.current.has(lid)) { linkPool.current.set(lid, { ...l }); }
            });
            childMap.current.set(node.id, Array.from(directChildIds));
          }
          updateVisibleGraph();
          setTimeout(() => { 
            if (fgRef.current) {
              fgRef.current.d3ReheatSimulation(); 
              fgRef.current.centerAt(node.x, node.y, 800);
              fgRef.current.zoom(1.5, 800);
            }
          }, 100);
        } catch (err) { node.loading = false; updateVisibleGraph(); }
      }
    }
  }, [updateVisibleGraph, globalMode, metrics.padding]);

  const handleResetView = useCallback(() => {
    fgRef.current?.zoomToFit(800, metrics.padding);
  }, [metrics.padding]);

  useEffect(() => {
    if (resetCounter > 0) {
      handleResetView();
    }
  }, [resetCounter, handleResetView]);

  const paintNode = useCallback((raw: any, ctx: CanvasRenderingContext2D, gs: number) => {
    const id = raw.id;
    const isHovered = hoveredNode?.id === id;
    const hasFocus = !!selectedId || (globalMode === 'view' && !!hoveredNode) || !!filterClass;
    const isHighlighted = !hasFocus || highlightNodes.has(id);

    ctx.save();
    ctx.globalAlpha = isHighlighted ? 1 : 0.15;
    const cls = raw.class as NodeClass;
    const x = raw.x ?? 0, y = raw.y ?? 0;
    const r = metrics.radius;
    let color = PALETTE[cls] ?? PALETTE.default;

    // Hover highlight (Light Brown / Taupe)
    if (isHovered && globalMode !== 'inspect') {
      ctx.beginPath(); ctx.arc(x, y, r + 4 / gs, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(163, 147, 130, 0.2)'; ctx.fill();
    }

    const isExp = raw.expanded;
    const isLeaf = raw.isLeaf;

    if (isLeaf) {
      const h = r * 0.85;
      ctx.beginPath(); 
      ctx.moveTo(x, y - h); 
      ctx.lineTo(x + h, y); 
      ctx.lineTo(x, y + h); 
      ctx.lineTo(x - h, y); 
      ctx.closePath();
      
      if (cls === 'validation') {
        ctx.fillStyle = '#FFFFFF'; ctx.fill();
        ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1.5 / gs; ctx.stroke();
      } else {
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1 / gs; ctx.stroke();
      }
    } else if (cls === 'validation') {
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.strokeStyle = '#1A1A1A'; ctx.lineWidth = 1.5 / gs; ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
      if (isExp) { ctx.fillStyle = color; ctx.fill(); }
      else { 
        ctx.fillStyle = '#FFFFFF'; ctx.fill(); 
        ctx.strokeStyle = color; ctx.lineWidth = 2 / gs; ctx.stroke(); 
      }
    }

    if (raw.loading) { ctx.beginPath(); ctx.arc(x, y, r + 4 / gs, 0, Math.PI * 1.5); ctx.strokeStyle = color; ctx.lineWidth = 3 / gs; ctx.stroke(); }

    const baseFS = gridSize > 1 ? 14 : 12;
    const fs = Math.max(baseFS / gs, 3);
    ctx.font = `bold ${isLeaf ? 'italic ' : ''}${fs}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const ly = y + r + 10 / gs;
    ctx.lineWidth = 5 / gs; ctx.strokeStyle = LABEL_HALO; ctx.lineJoin = 'round';
    ctx.strokeText(raw.label, x, ly);
    ctx.fillStyle = '#111111';
    ctx.fillText(raw.label, x, ly);
    ctx.restore();
  }, [selectedId, hoveredNode, globalMode, highlightNodes, gridSize, metrics.radius]);

  const paintPointerArea = useCallback((raw: any, color: string, ctx: CanvasRenderingContext2D) => {
    const r = metrics.radius;
    ctx.fillStyle = color;
    if (raw.isLeaf) {
      const h = r * 0.85;
      ctx.beginPath(); ctx.moveTo(raw.x, raw.y - h); ctx.lineTo(raw.x + h, raw.y); ctx.lineTo(raw.x, raw.y + h); ctx.lineTo(raw.x - h, raw.y); ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(raw.x, raw.y, r, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [metrics.radius]);

  const paintLink = useCallback((raw: any, ctx: CanvasRenderingContext2D, gs: number) => {
    const hasFocus = !!selectedId || (globalMode === 'view' && !!hoveredNode) || !!filterClass;
    const isHighlighted = !hasFocus || highlightLinks.has(raw);
    ctx.save();
    ctx.globalAlpha = isHighlighted ? 1 : 0.15;

    const sx = (raw.source as any)?.x ?? 0, sy = (raw.source as any)?.y ?? 0;
    const tx = (raw.target as any)?.x ?? 0, ty = (raw.target as any)?.y ?? 0;

    // Active connections: solid dark grey. Potential: dashed light grey.
    const isPotential = raw.label?.toLowerCase().includes('potential') || raw.label?.toLowerCase().includes('soft');

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);

    if (isPotential) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    } else {
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    }

    ctx.lineWidth = highlightLinks.has(raw) ? 4.5 / gs : 1.8 / gs;
    ctx.stroke();

    if (gs >= 0.75 && raw.label) {
      const mx = (sx + tx) / 2, my = (sy + ty) / 2;
      const baseFS = gridSize > 1 ? 10 : 9;
      const fs = Math.max(baseFS / gs, 2);
      ctx.font = `bold italic ${fs}px ${FONT_FAMILY}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 4 / gs; ctx.strokeStyle = LABEL_HALO; ctx.lineJoin = 'round';
      ctx.strokeText(raw.label, mx, my);
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillText(raw.label, mx, my);
    }
    ctx.restore();
  }, [selectedId, hoveredNode, globalMode, highlightLinks, gridSize]);

  const handleZoom = useCallback(({ x, y, k }: { x: number, y: number, k: number }) => {
    const el = containerRef.current;
    if (!el) return;

    // 1. Update Background Grid
    const s = 20 * k;
    const ms = 100 * k;
    el.style.backgroundSize = `${s}px ${s}px, ${s}px ${s}px, ${ms}px ${ms}px, ${ms}px ${ms}px`;
    el.style.backgroundPosition = `${x}px ${y}px`;

    // 2. Update Rulers DIRECTLY via DOM
    if (hRulerRef.current) {
      hRulerRef.current.style.transform = `translateX(${-x}px)`;
      const hTicks = hRulerRef.current.querySelectorAll('.tick-label');
      hTicks.forEach((tick: any) => {
        const val = parseInt(tick.getAttribute('data-val') || '0');
        const left = val * k + (dim.width / 2) + x;
        tick.style.left = `${left}px`;
      });
    }
    if (vRulerRef.current) {
      vRulerRef.current.style.transform = `translateY(${-y}px)`;
      const vTicks = vRulerRef.current.querySelectorAll('.tick-label');
      vTicks.forEach((tick: any) => {
        const val = parseInt(tick.getAttribute('data-val') || '0');
        const top = val * k + (dim.height / 2) + y;
        tick.style.top = `${top}px`;
      });
    }
  }, [dim]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full bg-[#FFFFFF] ${gridSize > 1 ? 'border border-black/10' : ''} ${isPreview ? 'pointer-events-none' : ''}`}
      onContextMenu={(e) => e.preventDefault()}
      style={{ 
        cursor: isPreview ? 'default' : cursorStyle,
        overflow: 'hidden',
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px',
        backgroundPosition: '0 0'
      }}
    >
      {/* TECHNICAL RULER */}
      {!isPreview && showRulers && gridSize === 1 && (
        <>
          <div className="absolute top-0 left-0 right-0 h-7 bg-white/40 border-b border-black/20 z-20 overflow-hidden pointer-events-none backdrop-blur-sm">
            <div ref={hRulerRef} className="relative h-full will-change-transform">
              {Array.from({ length: 41 }).map((_, i) => {
                const val = (i - 20) * 100;
                return (
                  <div key={`hr-${val}`} data-val={val} className="tick-label absolute top-0 flex flex-col items-center">
                    <div className="w-[1px] h-3 bg-black/20" />
                    <span className="text-[9px] text-[#000000] font-mono mt-1">{val === 0 ? '0' : val}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute top-0 left-0 bottom-0 w-7 bg-white/40 border-r border-black/20 z-20 overflow-hidden pointer-events-none backdrop-blur-sm">
            <div ref={vRulerRef} className="relative w-full h-full will-change-transform">
              {Array.from({ length: 31 }).map((_, i) => {
                const val = (i - 15) * 100;
                return (
                  <div key={`vr-${val}`} data-val={val} className="tick-label absolute left-0 flex items-center">
                    <div className="w-3 h-[1px] bg-black/20" />
                    <span className="text-[9px] text-[#000000] font-mono ml-1" style={{ transform: 'rotate(-90deg)' }}>{val === 0 ? '0' : val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* HYPER-MINIMALIST FLOATING LEGEND */}
      {!isPreview && showLegend && (
        <div className="absolute top-10 right-10 z-[60] pointer-events-auto select-none transition-all animate-in fade-in duration-700">
          <div className="space-y-4">
            {[
              { label: 'Root',       id: 'root',       color: '#1A1A1A', desc: 'Primary Entry Point' },
              { label: 'Domain',     id: 'domain',     color: '#666666', desc: 'Research Sector' },
              { label: 'System',     id: 'system',     color: '#C2B280', desc: 'Functional Module' },
              { label: 'Validation', id: 'validation', color: '#FFFFFF', desc: 'Verification Gate', isHollow: true },
              { label: 'Technical',  id: 'tech',       color: '#CCCCCC', desc: 'Technical Infrastructure' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setFilterClass(filterClass === item.id ? null : item.id as NodeClass)}
                className={`group relative flex items-center gap-3 transition-all duration-300 hover:translate-x-[-4px] ${filterClass && filterClass !== item.id ? 'opacity-20 grayscale' : 'opacity-100'}`}
              >
                {/* HOVER HINT (LEFT SIDE) */}
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0 z-[3000]">
                  <div className="bg-[#111111] text-white px-2.5 py-1.5 rounded-md text-[10px] font-semibold tracking-tight shadow-xl flex flex-col items-end min-w-[120px]">
                    <span className="leading-tight">{item.label} Class</span>
                    <span className="text-[8px] text-[#9CA3AF] font-normal mt-0.5 text-right">{item.desc}</span>
                  </div>
                </div>

                <div className={`w-3 h-3 rounded-full transition-transform ${item.isHollow ? 'border border-black' : ''} ${filterClass === item.id ? 'scale-150 shadow-lg shadow-black/10' : ''}`} style={{ backgroundColor: item.color }} />
                <span className={`text-[10px] font-black text-[#000000] uppercase tracking-tighter ${filterClass === item.id ? 'underline underline-offset-4' : ''}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dim.width} height={dim.height}
        nodeCanvasObject={paintNode}
        nodeCanvasObjectMode={() => 'replace'}
        nodePointerAreaPaint={paintPointerArea}
        linkColor={() => 'transparent'} // Using custom paintLink instead
        linkWidth={l => highlightLinks.has(l) ? 4.5 : 1.8}
        linkCanvasObject={paintLink}
        linkCanvasObjectMode={() => 'replace'}
        onNodeClick={isPreview ? undefined : handleNodeClick}
        onNodeHover={isPreview ? undefined : setHoveredNode}
        onBackgroundClick={isPreview ? undefined : () => { setSelectedId(null); setDetail(null); }}
        onZoom={handleZoom}
        enableNodeDrag={!isPreview && globalMode === 'view'}
        enableZoomInteraction={!isPreview}
        enablePanInteraction={!isPreview}
        cooldownTicks={120} d3VelocityDecay={0.35}
        minZoom={0.1} maxZoom={maxZoomLevel}
      />

      <GraphInspector detail={detail} loading={loadingDetail} onClose={() => { setSelectedId(null); setDetail(null); }} />
    </div>
  );
}
