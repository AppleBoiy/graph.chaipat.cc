export type NodeClass = 'root' | 'domain' | 'system' | 'validation' | 'tech';

export interface KGNode {
  id: string;
  label: string;
  class: NodeClass;
}

export interface KGLink {
  source: string;
  target: string;
  label: string;
}

export interface NeighborResult {
  nodes: KGNode[];
  links: KGLink[];
}

export interface NodeDetail {
  id: string;
  label: string;
  class: NodeClass;
  description: string;
  telemetry: { label: string; value: string }[];
}

export const ROOT_NODE: KGNode = { id: 'idx', label: 'Master Index', class: 'root' };
