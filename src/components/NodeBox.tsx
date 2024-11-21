import React from 'react';
import Draggable from 'react-draggable';
import type { Node, ComponentType } from '../types/node';

interface NodeBoxProps {
  id: string;
  node: Node;
  position: { x: number; y: number };
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onStartConnection: (nodeId: string, portId: string, portType: 'input' | 'output', event: React.MouseEvent) => void;
  onEndConnection: (nodeId: string, portId: string, portType: 'input' | 'output', event: React.MouseEvent) => void;
}

export const NodeBox: React.FC<NodeBoxProps> = ({ id, node, position, onDrag, onStartConnection, onEndConnection })  => {
  const getComponentColor = (type: ComponentType): string => {
    switch (type) {
      case 'geometry': return '#2196F3';
      case 'texture': return '#9C27B0';
      case 'composite': return '#FF9800';
      case 'interaction': return '#4CAF50';
      default: return '#333333';
    }
  };

  const getComponentLabel = (type: ComponentType): string => {
    switch (type) {
      case 'geometry': return 'ジオメトリ';
      case 'texture': return 'テクスチャ';
      case 'composite': return '合成処理';
      case 'interaction': return 'インタラクション';
      default: return 'Node';
    }
  };

  return (
    <Draggable
      position={position}
      onDrag={(e, data) => onDrag(id, { x: data.x, y: data.y })}
      bounds="parent"
      cancel=".node-connector"
    >
      <div 
        className="node-box" 
        style={{ backgroundColor: getComponentColor(node.componentType) }}
      >
        <div className="node-title">
          {`${getComponentLabel(node.componentType)} ${node.componentNumber}`}
        </div>
        
        <div 
          className="node-connector input"
          style={{ backgroundColor: '#3b82f6' }}
          onMouseDown={(e) => onStartConnection(id, node.input.id, 'input', e)}
          onMouseUp={(e) => onEndConnection(id, node.input.id, 'input', e)}
        />
        <div 
          className="node-connector output"
          style={{ backgroundColor: '#10b981' }}
          onMouseDown={(e) => onStartConnection(id, node.output.id, 'output', e)}
          onMouseUp={(e) => onEndConnection(id, node.output.id, 'output', e)}
        />
      </div>
    </Draggable>
  );
};