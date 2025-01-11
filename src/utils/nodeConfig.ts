export type NodeCategory = 'function' | 'geometry' | 'texture' | 'interaction';
export type NodeType = 
  | 'input' | 'arithmetic' | 'trigonometric'  // function
  | 'cube' | 'sphere' | 'cylinder'           // geometry
  | 'color' | 'image' | 'gradient'          // texture
  | 'drag' | 'click' | 'hover';             // interaction

interface NodeConfig {
  category: NodeCategory;
  type: NodeType;
  label: string;
  inputs: { [key: string]: any };
  outputs: { [key: string]: any };
  defaultValue?: any;
  operations?: string[];
}

export const getDefaultConfig = (category: string, type: string): NodeConfig => {
  switch (category) {
    case 'function':
      switch (type) {
        case 'input':
          return {
            category: 'function',
            type: 'input',
            label: '数値入力',
            inputs: {},
            outputs: { value: 0 },
            defaultValue: 0
          };
        case 'arithmetic':
          return {
            category: 'function',
            type: 'arithmetic',
            label: '四則演算',
            inputs: { input1: 0, input2: 0 },
            outputs: { result: 0 },
            operations: ['add', 'subtract', 'multiply', 'divide'],
            defaultValue: 'add'
          };
        case 'trigonometric':
          return {
            category: 'function',
            type: 'trigonometric',
            label: '三角関数',
            inputs: { input: 0 },
            outputs: { result: 0 },
            operations: ['sin', 'cos', 'tan'],
            defaultValue: 'sin'
          };
        default:
          break;
      }
      break;

    case 'geometry':
      switch (type) {
        case 'cube':
          return {
            category: 'geometry',
            type: 'cube',
            label: 'キューブ',
            inputs: { size: 1, position: { x: 0, y: 0, z: 0 } },
            outputs: { geometry: null }
          };
        case 'sphere':
          return {
            category: 'geometry',
            type: 'sphere',
            label: '球体',
            inputs: { radius: 1, position: { x: 0, y: 0, z: 0 } },
            outputs: { geometry: null }
          };
        default:
          break;
      }
      break;

    case 'texture':
      switch (type) {
        case 'color':
          return {
            category: 'texture',
            type: 'color',
            label: 'カラー',
            inputs: { r: 1, g: 1, b: 1 },
            outputs: { color: null },
            defaultValue: '#ffffff'
          };
        case 'image':
          return {
            category: 'texture',
            type: 'image',
            label: '画像',
            inputs: { url: '' },
            outputs: { texture: null }
          };
        default:
          break;
      }
      break;

    case 'interaction':
      switch (type) {
        case 'drag':
          return {
            category: 'interaction',
            type: 'drag',
            label: 'ドラッグ',
            inputs: { target: null },
            outputs: { position: { x: 0, y: 0 } }
          };
        case 'click':
          return {
            category: 'interaction',
            type: 'click',
            label: 'クリック',
            inputs: { target: null },
            outputs: { clicked: false }
          };
        default:
          break;
      }
      break;
  }

  throw new Error(`Invalid category or type: ${category}/${type}`);
};