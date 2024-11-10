import React from 'react';
import Draggable from 'react-draggable';
import type { Node } from '../types/node';

interface NodeBoxProps {
  id: string;
  node: Node;
  position: { x: number; y: number };
  onDrag: (id: string, position: { x: number; y: number }) => void;
  onStartConnection: (nodeId: string, portId: string, portType: 'input' | 'output', event: React.MouseEvent) => void;
  onEndConnection: (nodeId: string, portId: string, portType: 'input' | 'output', event: React.MouseEvent) => void;
}

export const NodeBox: React.FC<NodeBoxProps> = ({ id, node, position, onDrag, onStartConnection, onEndConnection })  => {
  return (
    <Draggable
      position={position}
      onDrag={(e, data) => onDrag(id, { x: data.x, y: data.y })}
      bounds="parent"
      cancel=".node-connector"
    >
      <div className="node-box">
        <h3 className="node-title">Node {id}</h3>
        <div 
          className="node-connector input"
          style={{ top: node.input.y }}
          onMouseUp={(e) => {
            e.stopPropagation();
            onEndConnection(id, node.input.id, 'input', e);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnection(id, node.input.id, 'input', e);
          }}
        />
        <div 
          className="node-connector output"
          style={{ top: node.output.y }}
          onMouseUp={(e) => {
            e.stopPropagation();
            onEndConnection(id, node.output.id, 'output', e);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConnection(id, node.output.id, 'output', e);
          }}
        />
      </div>
    </Draggable>
  );
};