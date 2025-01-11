import React, { useState } from 'react';
import type { ComponentType, NodeType } from '../types/node';
import styles from './ComponentSelector.module.css';

interface ComponentSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (componentType: ComponentType, nodeType: NodeType) => void;
}

interface SubMenuItem {
  type: NodeType;
  label: string;
}

const components: {
  type: ComponentType;
  label: string;
  color: string;
  subItems: SubMenuItem[];
}[] = [
  {
    type: 'function',
    label: '数学関数',
    color: '#E91E63',  // ピンク系: 数学的な処理を表現
    subItems: [
      // 基本要素
      { type: 'input', label: '数値入力' },
      { type: 'parentheses', label: '( )' },
      // 演算子
      { type: 'add', label: '+' },
      { type: 'subtract', label: '-' },
      { type: 'multiply', label: '×' },
      { type: 'divide', label: '÷' },
      // 高度な関数
      { type: 'power', label: '累乗' },
      { type: 'sin', label: 'sin' },
      { type: 'cos', label: 'cos' },
      { type: 'tan', label: 'tan' },
      { type: 'derivative', label: '微分' },
      { type: 'integral', label: '積分' }
    ]
  },
  {
    type: 'geometry',
    label: 'ジオメトリ',
    color: '#2196F3',
    subItems: [
      { type: 'cube', label: 'キューブ' },
      { type: 'sphere', label: '球体' },
      { type: 'cylinder', label: '円柱' }
    ]
  },
  {
    type: 'texture',
    label: 'テクスチャ',
    color: '#9C27B0',
    subItems: [
      { type: 'color', label: 'カラー' },
      { type: 'image', label: '画像' },
      { type: 'gradient', label: 'グラデーション' }
    ]
  },
  {
    type: 'composite',
    label: '合成処理',
    color: '#FF9800',
    subItems: [
      { type: 'blend', label: 'ブレンド' },
      { type: 'mask', label: 'マスク' }
    ]
  },
  {
    type: 'interaction',
    label: 'インタラクション',
    color: '#4CAF50',
    subItems: [
      { type: 'drag', label: 'ドラッグ' },
      { type: 'click', label: 'クリック' },
      { type: 'hover', label: 'ホバー' }
    ]
  }
];

export const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [hoveredComponent, setHoveredComponent] = useState<ComponentType | null>(null);

  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
        <h2 className={styles['modal-title']}>コンポーネントを選択</h2>
        <div className={styles['component-list']}>
          {components.map(({ type, label, color, subItems }) => (
            <div
              key={type}
              className={styles['component-item']}
              onMouseEnter={() => setHoveredComponent(type)}
            >
              <div className={styles['component-content']}>
                <button
                  className={styles['component-button']}
                  style={{ backgroundColor: color }}
                >
                  {label}
                </button>
                {hoveredComponent === type && (
                  <div className={styles['sub-menu']}>
                    {subItems.map(subItem => (
                      <button
                        key={subItem.type}
                        className={styles['sub-menu-item']}
                        onClick={() => {
                          onSelect(type, subItem.type);
                          onClose();
                        }}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
