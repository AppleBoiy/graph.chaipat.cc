export type NodeType = 'domain' | 'core' | 'tech';

export interface Node {
  id: string;
  label: string;
  x: string;
  y: string;
  type: NodeType;
}

export interface Connection {
  from: string;
  to: string;
}

export interface SystemStat {
  l: string;
  v: string;
  c?: string;
}
