import React from 'react';
import type { Node, DraggingConnection } from '../types/node';
import { createPath } from '../utils/path';

interface ConnectionLinesProps {
  nodes: Record<string, Node>;
  draggingConnection: DraggingConnection | null;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ nodes, draggingConnection })=> {
  const createPath = (startX: number, startY: number, endX: number, endY: number) => {
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const curvature = Math.min(distance * 0.5, 100);
    
    const controlPoint1X = startX + curvature;
    const controlPoint2X = endX - curvature;
    
    return `M ${startX} ${startY} C ${controlPoint1X} ${startY}, ${controlPoint2X} ${endY}, ${endX} ${endY}`;
  };

  return (
    <svg className="connection-svg">
      {Object.values(nodes).map(sourceNode => {
        return sourceNode.output.connections.map((targetPortId, idx) => {
          const targetNode = Object.values(nodes).find(n => 
            n.input.id === targetPortId
          );

          if (targetNode) {
            return (
              <path
                key={`${sourceNode.output.id}-${targetPortId}-${idx}`}
                d={createPath(
                  sourceNode.position.x + 160,
                  sourceNode.position.y + sourceNode.output.y,
                  targetNode.position.x,
                  targetNode.position.y + targetNode.input.y
                )}
                className="connection-path"
              />
            );
          }
          return null;
        });
      })}

      {draggingConnection && nodes[draggingConnection.sourceId] && (
        <path
          className="connection-path dragging"
          d={createPath(
            draggingConnection.sourceType === 'output'
              ? nodes[draggingConnection.sourceId].position.x + 160
              : draggingConnection.x,
            draggingConnection.sourceType === 'output'
              ? nodes[draggingConnection.sourceId].position.y + nodes[draggingConnection.sourceId].output.y
              : draggingConnection.y,
            draggingConnection.x,
            draggingConnection.y
          )}
        />
      )}
    </svg>
  );
};