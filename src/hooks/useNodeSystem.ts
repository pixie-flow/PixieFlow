import { useState } from 'react';
import type { Node, DraggingConnection } from '../types/node';

export const useNodeSystem = () => {
  const [nodes, setNodes] = useState<Record<string, Node>>({});
  const [draggingConnection, setDraggingConnection] = useState<{
    sourceId: string;
    sourceType: 'input' | 'output';
    sourcePortId: string;
    x: number;
    y: number;
  } | null>(null);

  const addNode = (id: string, position: { x: number; y: number }) => {
    setNodes(prev => ({
      ...prev,
      [id]: {
        id,
        position,
        input: {
          id: `${id}-in`,
          y: 30,
          connections: []
        },
        output: {
          id: `${id}-out`,
          y: 30,
          connections: []
        }
      }
    }));
  };

  const updateNodePosition = (id: string, position: { x: number; y: number }) => {
    setNodes(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        position
      }
    }));
  };

  const startConnection = (nodeId: string, portId: string, portType: 'input' | 'output', event: React.MouseEvent) => {
    event.stopPropagation();
    setDraggingConnection({
      sourceId: nodeId,
      sourceType: portType,
      sourcePortId: portId,
      x: event.clientX,
      y: event.clientY
    });
  };

  const endConnection = (targetNodeId: string, targetPortId: string, targetType: 'input' | 'output', event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!draggingConnection || draggingConnection.sourceType === targetType) {
      setDraggingConnection(null);
      return;
    }

    setNodes(prev => {
      const newNodes = { ...prev };
      const sourceNode = newNodes[draggingConnection.sourceId];
      const targetNode = newNodes[targetNodeId];

      const connectionExists = sourceNode.output.connections.includes(targetPortId) ||
                             targetNode.input.connections.includes(draggingConnection.sourcePortId);

      if (!connectionExists) {
        if (draggingConnection.sourceType === 'output') {
          sourceNode.output.connections.push(targetPortId);
          targetNode.input.connections.push(draggingConnection.sourcePortId);
        } else {
          targetNode.output.connections.push(draggingConnection.sourcePortId);
          sourceNode.input.connections.push(targetPortId);
        }
      }

      return newNodes;
    });

    setDraggingConnection(null);
  };

  const removeConnection = (nodeId: string, portId: string, connectedPortId: string) => {
    setNodes(prev => {
      const newNodes = { ...prev };
      const node = newNodes[nodeId];
      
      node.input.connections = node.input.connections.filter(id => id !== connectedPortId);
      node.output.connections = node.output.connections.filter(id => id !== connectedPortId);

      Object.values(newNodes).forEach(otherNode => {
        if (otherNode.id !== nodeId) {
          otherNode.input.connections = otherNode.input.connections.filter(id => id !== portId);
          otherNode.output.connections = otherNode.output.connections.filter(id => id !== portId);
        }
      });

      return newNodes;
    });
  };

  return {
    nodes,
    draggingConnection,
    addNode,
    updateNodePosition,
    startConnection,
    endConnection,
    removeConnection,
    updateDraggingConnection: (event) => {
      if (draggingConnection) {
        setDraggingConnection(prev => ({
          ...prev!,
          x: event.clientX,
          y: event.clientY
        }));
      }
    },
    clearDraggingConnection: () => setDraggingConnection(null)
  };
};