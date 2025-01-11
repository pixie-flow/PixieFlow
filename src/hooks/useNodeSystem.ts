import React, { useState, useEffect } from 'react';
import type { Node, DraggingConnection, ComponentType, NodeType } from '../types/node';
import { getDefaultConfig } from '../utils/nodeConfig';

export const useNodeSystem = () => {
  const [nodes, setNodes] = useState<Record<string, Node>>({});
  const [draggingConnection, setDraggingConnection] = useState<{
    sourceId: string;
    sourceType: 'input' | 'output';
    sourcePortId: string;
    x: number;
    y: number;
  } | null>(null);
  const [componentCounters, setComponentCounters] = useState<Record<ComponentType, number>>({
    geometry: 0,
    texture: 0,
    composite: 0,
    interaction: 0,
    function: 0
  });

  const addNode = (id: string, options: { x: number; y: number; componentType: ComponentType; nodeType: NodeType }) => {
    setNodes(prev => {
      const currentCount = componentCounters[options.componentType];
      const config = getDefaultConfig(options.componentType, options.nodeType);
      
      setComponentCounters(prevCounters => ({
        ...prevCounters,
        [options.componentType]: currentCount + 1
      }));

      const newNode = {
        id,
        position: { x: options.x, y: options.y },
        componentType: options.componentType,
        nodeType: options.nodeType,
        componentNumber: currentCount + 1,
        input: {
          id: `${id}-in`,
          y: 20,
          connections: []
        },
        output: {
          id: `${id}-out`,
          y: 20,
          connections: []
        },
        values: { ...config.inputs }
      };

      // 括弧ノードの場合、特別なプロパティを追加
      if (options.nodeType === 'parentheses') {
        return {
          ...prev,
          [id]: {
            ...newNode,
            isContainer: true,
            containedNodes: [],
            // 括弧ノードのサイズを大きくする
            values: {
              width: 300,
              height: 200
            }
          }
        };
      }

      return {
        ...prev,
        [id]: newNode
      };
    });
  };

  // ノードが括弧内に入っているかチェック
  const checkNodeInContainer = (nodePosition: { x: number; y: number }, containerNode: Node) => {
    const { x, y } = nodePosition;
    const { position, values } = containerNode;
    return (
      x >= position.x &&
      x <= position.x + values.width &&
      y >= position.y &&
      y <= position.y + values.height
    );
  };

  // ノードの移動時に括弧との関係を更新
  const updateNodePosition = (id: string, position: { x: number; y: number }) => {
    setNodes(prev => {
      const newNodes = { ...prev };
      const movedNode = newNodes[id];
      
      // 括弧ノード以外のノードが移動された場合
      if (movedNode.nodeType !== 'parentheses') {
        // 以前の親括弧から削除
        if (movedNode.parentContainer) {
          const oldContainer = newNodes[movedNode.parentContainer];
          oldContainer.containedNodes = oldContainer.containedNodes?.filter(nId => nId !== id);
        }

        // 新しい親括弧を探す
        const containerNode = Object.values(newNodes).find(node => 
          node.isContainer && checkNodeInContainer(position, node)
        );

        if (containerNode) {
          movedNode.parentContainer = containerNode.id;
          if (!containerNode.containedNodes?.includes(id)) {
            containerNode.containedNodes?.push(id);
          }
        } else {
          movedNode.parentContainer = undefined;
        }
      }

      // 括弧ノードが移動された場合、含まれるノードも一緒に移動
      if (movedNode.isContainer && movedNode.containedNodes) {
        const dx = position.x - movedNode.position.x;
        const dy = position.y - movedNode.position.y;
        movedNode.containedNodes.forEach(containedId => {
          const containedNode = newNodes[containedId];
          containedNode.position.x += dx;
          containedNode.position.y += dy;
        });
      }

      movedNode.position = position;
      return newNodes;
    });
  };

  const updateNodeValue = (nodeId: string, key: string, value: any) => {
    setNodes(prev => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        values: {
          ...prev[nodeId].values,
          [key]: value
        }
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

  const [resizingNode, setResizingNode] = useState<{
    id: string;
    startWidth: number;
    startHeight: number;
    startX: number;
    startY: number;
  } | null>(null);

  const startResizing = (nodeId: string, event: React.MouseEvent) => {
    const node = nodes[nodeId];
    setResizingNode({
      id: nodeId,
      startWidth: node.values.width,
      startHeight: node.values.height,
      startX: event.clientX,
      startY: event.clientY
    });
  };

  const updateResizing = (event: React.MouseEvent) => {
    if (!resizingNode) return;

    const dx = event.clientX - resizingNode.startX;
    const dy = event.clientY - resizingNode.startY;

    setNodes(prev => ({
      ...prev,
      [resizingNode.id]: {
        ...prev[resizingNode.id],
        values: {
          ...prev[resizingNode.id].values,
          width: Math.max(300, resizingNode.startWidth + dx),
          height: Math.max(200, resizingNode.startHeight + dy)
        }
      }
    }));
  };

  const stopResizing = () => {
    setResizingNode(null);
  };

  // マウスイベントのハンドラーを追加
  React.useEffect(() => {
    if (resizingNode) {
      const handleMouseMove = (e: MouseEvent) => {
        updateResizing(e as unknown as React.MouseEvent);
      };
      const handleMouseUp = () => {
        stopResizing();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizingNode]);

  return {
    nodes,
    draggingConnection,
    addNode,
    updateNodePosition,
    updateNodeValue,
    startConnection,
    endConnection,
    removeConnection,
    startResizing,
    updateDraggingConnection: (event: React.MouseEvent) => {
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
