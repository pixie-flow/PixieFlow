export type ComponentType = 'geometry' | 'texture' | 'composite' | 'interaction' | 'function';

export type NodeType = 
  // 数学関連の機能
  | 'input'                                 // 数値入力
  | 'add' | 'subtract' | 'multiply' | 'divide'  // 四則演算
  | 'parentheses'                          // 括弧（計算優先順位）
  | 'power'                                // 累乗
  | 'sin' | 'cos' | 'tan'                  // 三角関数
  | 'derivative' | 'integral'              // 微積分
  // ジオメトリ
  | 'cube' | 'sphere' | 'cylinder'
  // テクスチャ
  | 'color' | 'image' | 'gradient'
  // 合成
  | 'blend' | 'mask'
  // インタラクション
  | 'drag' | 'click' | 'hover';

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
  // 括弧ノード用の追加プロパティ
  isContainer?: boolean;
  containedNodes?: string[];  // 括弧内のノードIDのリスト
  parentContainer?: string;   // このノードを含む括弧ノードのID
}

export interface DraggingConnection {
  sourceId: string;
  sourceType: 'input' | 'output';
  sourcePortId: string;
  x: number;
  y: number;
}
