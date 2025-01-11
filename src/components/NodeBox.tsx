import React, { useMemo } from 'react';
import Draggable from 'react-draggable';
import type { Node, ComponentType, NodeType } from '../types/node';
import { getDefaultConfig } from '../utils/nodeConfig';

interface NodeBoxProps {
  id: string;
  node: Node;
  position: { x: number; y: number };
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onStartConnection: (nodeId: string, portId: string, portType: 'input' | 'output', event: React.MouseEvent) => void;
  onEndConnection: (nodeId: string, portId: string, portType: 'input' | 'output', event: React.MouseEvent) => void;
  onValueChange: (nodeId: string, key: string, value: any) => void;
  onStartResizing: (nodeId: string, event: React.MouseEvent) => void;
}

export const NodeBox: React.FC<NodeBoxProps> = ({ 
  id, 
  node, 
  position, 
  onDrag, 
  onStartConnection, 
  onEndConnection,
  onValueChange,
  onStartResizing
}) => {
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

  const config = useMemo(() => getDefaultConfig(node.componentType, node.nodeType), [node.componentType, node.nodeType]);

  const renderInputField = (key: string, value: any) => {
    if (typeof value === 'number') {
      return (
        <div key={key} className="node-input-field">
          <label>{key}:</label>
          <input
            type="number"
            value={node.values[key]}
            onChange={(e) => onValueChange(id, key, parseFloat(e.target.value))}
          />
        </div>
      );
    }
    if (typeof value === 'string') {
      return (
        <div key={key} className="node-input-field">
          <label>{key}:</label>
          <input
            type="text"
            value={node.values[key]}
            onChange={(e) => onValueChange(id, key, e.target.value)}
          />
        </div>
      );
    }
    if (value && typeof value === 'object' && 'x' in value) {
      return (
        <div key={key} className="node-input-field vector">
          <label>{key}:</label>
          <div className="vector-inputs">
            <input
              type="number"
              value={node.values[key].x}
              onChange={(e) => onValueChange(id, key, { ...node.values[key], x: parseFloat(e.target.value) })}
              placeholder="x"
            />
            <input
              type="number"
              value={node.values[key].y}
              onChange={(e) => onValueChange(id, key, { ...node.values[key], y: parseFloat(e.target.value) })}
              placeholder="y"
            />
            <input
              type="number"
              value={node.values[key].z}
              onChange={(e) => onValueChange(id, key, { ...node.values[key], z: parseFloat(e.target.value) })}
              placeholder="z"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Draggable
      position={position}
      onDrag={(e, data) => onDrag(id, { x: data.x, y: data.y })}
      bounds="parent"
      cancel=".node-connector"
    >
      <div 
        className={`node-box ${node.isContainer ? 'node-container' : ''}`}
        style={{ 
          backgroundColor: getComponentColor(node.componentType),
          width: node.isContainer ? node.values.width : 200,
          height: node.isContainer ? node.values.height : 'auto',
          border: node.isContainer ? '2px dashed rgba(255, 255, 255, 0.3)' : undefined,
          padding: node.isContainer ? '20px' : '12px'
        }}
      >
        <div className="node-title">
          {config.label}
          {node.isContainer && (
            <div className="container-controls">
              <div className="container-info">
                <button 
                  className="resize-handle"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onStartResizing(id, e);
                  }}
                >
                  ↘
                </button>
                <div className="node-count" title="内部のノード数">
                  {node.containedNodes?.length || 0}
                </div>
                {node.containedNodes?.length ? (
                  <div className="contained-nodes">
                    {node.containedNodes.map(nodeId => (
                      <div key={nodeId} className="contained-node-indicator" />
                    ))}
                  </div>
                ) : (
                  <div className="empty-container-message">
                    ノードをドラッグして追加
                  </div>
                )}
              </div>
              <span className="node-count">
                {node.containedNodes?.length || 0} nodes
              </span>
            </div>
          )}
        </div>
        <div className="node-content">
          {node.nodeType === 'input' ? (
            <div className="node-input-field">
              <input
                type="number"
                value={node.values.value || 0}
                onChange={(e) => onValueChange(id, 'value', parseFloat(e.target.value))}
                className="number-input"
              />
            </div>
          ) : (
            Object.entries(config.inputs).map(([key, value]) => renderInputField(key, value))
          )}
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
