export type ComponentType = 'geometry' | 'texture' | 'composite' | 'interaction' | 'function';

export type NodeType = 
  | 'cube' | 'sphere' | 'cylinder'           // geometry
  | 'color' | 'image' | 'gradient'          // texture
  | 'blend' | 'mask'                        // composite
  | 'drag' | 'click' | 'hover'              // interaction
  | 'arithmetic' | 'input' | 'trigonometric'; // function

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
  componentType: ComponentType;
  nodeType: NodeType;
  componentNumber: number;
  values: { [key: string]: any };
}

export interface DraggingConnection {
  sourceId: string;
  sourceType: 'input' | 'output';
  sourcePortId: string;
  x: number;
  y: number;
}
