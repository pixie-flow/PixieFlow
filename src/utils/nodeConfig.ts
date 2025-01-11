import type { ComponentType, NodeType } from '../types/node';

interface NodeConfig {
  category: ComponentType;
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
        // 四則演算（入力フィールドなし、純粋な演算子として機能）
        case 'add':
          return {
            category: 'function',
            type: 'add',
            label: '+',
            inputs: {},
            outputs: { result: 0 }
          };
        case 'subtract':
          return {
            category: 'function',
            type: 'subtract',
            label: '-',
            inputs: {},
            outputs: { result: 0 }
          };
        case 'multiply':
          return {
            category: 'function',
            type: 'multiply',
            label: '×',
            inputs: {},
            outputs: { result: 0 }
          };
        case 'divide':
          return {
            category: 'function',
            type: 'divide',
            label: '÷',
            inputs: {},
            outputs: { result: 0 }
          };
        // 括弧（計算優先順位）
        case 'parentheses':
          return {
            category: 'function',
            type: 'parentheses',
            label: '( )',
            inputs: {},
            outputs: { result: 0 }
          };
        // 累乗
        case 'power':
          return {
            category: 'function',
            type: 'power',
            label: '累乗',
            inputs: { base: 0, exponent: 2 },
            outputs: { result: 0 }
          };
        // 三角関数
        case 'sin':
          return {
            category: 'function',
            type: 'sin',
            label: 'サイン',
            inputs: { angle: 0 },
            outputs: { result: 0 }
          };
        case 'cos':
          return {
            category: 'function',
            type: 'cos',
            label: 'コサイン',
            inputs: { angle: 0 },
            outputs: { result: 0 }
          };
        case 'tan':
          return {
            category: 'function',
            type: 'tan',
            label: 'タンジェント',
            inputs: { angle: 0 },
            outputs: { result: 0 }
          };
        // 微積分
        case 'derivative':
          return {
            category: 'function',
            type: 'derivative',
            label: '微分',
            inputs: { 
              function: 0,
              point: 0,
              delta: 0.0001 // 数値微分の刻み幅
            },
            outputs: { result: 0 }
          };
        case 'integral':
          return {
            category: 'function',
            type: 'integral',
            label: '積分',
            inputs: { 
              function: 0,
              lowerBound: 0,
              upperBound: 1,
              steps: 1000 // 数値積分の分割数
            },
            outputs: { result: 0 }
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
        case 'cylinder':
          return {
            category: 'geometry',
            type: 'cylinder',
            label: '円柱',
            inputs: { 
              radius: 1, 
              height: 1,
              position: { x: 0, y: 0, z: 0 }
            },
            outputs: { geometry: null }
          };
        default:
          break;
      }
      break;

    case 'composite':
      switch (type) {
        case 'blend':
          return {
            category: 'composite',
            type: 'blend',
            label: 'ブレンド',
            inputs: { 
              mode: 'normal',
              opacity: 1.0,
              layer1: null,
              layer2: null
            },
            outputs: { result: null }
          };
        case 'mask':
          return {
            category: 'composite',
            type: 'mask',
            label: 'マスク',
            inputs: {
              source: null,
              mask: null,
              intensity: 1.0
            },
            outputs: { result: null }
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
        case 'gradient':
          return {
            category: 'texture',
            type: 'gradient',
            label: 'グラデーション',
            inputs: { 
              startColor: '#000000',
              endColor: '#ffffff',
              direction: 'horizontal'
            },
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
        case 'hover':
          return {
            category: 'interaction',
            type: 'hover',
            label: 'ホバー',
            inputs: { target: null },
            outputs: { hovered: false }
          };
        default:
          break;
      }
      break;
  }

  throw new Error(`Invalid category or type: ${category}/${type}`);
};
