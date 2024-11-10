export interface NodePort {
  id: string;
  y: number;
  connections: string[];
}

export interface Node {
  id: string;
  position: { x: number; y: number };
  input: NodePort;
  output: NodePort;
}

export interface DraggingConnection {
  sourceId: string;
  sourceType: 'input' | 'output';
  sourcePortId: string;
  x: number;
  y: number;
}