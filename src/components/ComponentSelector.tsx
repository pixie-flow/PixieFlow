import React from 'react';
import type { ComponentType } from '../types/node';

interface ComponentSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (componentType: ComponentType) => void;
}

const components: { type: ComponentType; label: string; color: string }[] = [
  { 
    type: 'geometry', 
    label: 'ジオメトリ', 
    color: '#2196F3'  // 青系: 形状を表現
  },
  { 
    type: 'texture', 
    label: 'テクスチャ', 
    color: '#9C27B0'  // 紫系: テクスチャ/画像表現
  },
  { 
    type: 'composite', 
    label: '合成処理', 
    color: '#FF9800'  // オレンジ系: 処理/変換表現
  },
  { 
    type: 'interaction', 
    label: 'インタラクション', 
    color: '#4CAF50'  // 緑系: インタラクティブ性表現
  },
];

export const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">コンポーネントを選択</h2>
        <div className="component-grid">
          {components.map(({ type, label, color }) => (
            <button
              key={type}
              className="component-button"
              style={{ backgroundColor: color }}
              onClick={() => {
                onSelect(type);
                onClose();
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
