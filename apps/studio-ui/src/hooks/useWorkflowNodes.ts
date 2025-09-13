import { useState, useCallback } from 'react';
import { 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  NodeChange, 
  EdgeChange, 
  Connection,
  Node,
  Edge
} from '@xyflow/react';
import { WorkflowNode, WorkflowEdge, TriggerType, ActionService } from '../types/workflow';
import { UI_CONSTANTS } from '../utils/constants';

export const useWorkflowNodes = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // ReactFlow handlers
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  // Add trigger node
  const addTriggerNode = useCallback((trigger: TriggerType) => {
    const triggerNode: Node = {
      id: 'trigger-1',
      type: 'trigger',
      position: UI_CONSTANTS.DEFAULT_NODE_POSITION,
      data: { 
        label: trigger.name,
        type: trigger.id,
        icon: trigger.icon,
        color: trigger.color,
        status: 'ready'
      },
    };
    
    setNodes([triggerNode]);
    
    // Auto-add a plus node for the next step
    setTimeout(() => {
      const plusNode: Node = {
        id: 'plus-1',
        type: 'default',
        position: { x: UI_CONSTANTS.DEFAULT_NODE_POSITION.x, y: UI_CONSTANTS.DEFAULT_NODE_POSITION.y + UI_CONSTANTS.NODE_SPACING },
        data: { label: '+ Add Action', type: 'plus' },
        style: { 
          backgroundColor: '#f0f0f0', 
          border: '2px dashed #ccc',
          borderRadius: '50%',
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }
      };
      
      setNodes(prev => [...prev, plusNode]);
      
      // Connect trigger to plus node
      const edge: Edge = {
        id: 'trigger-to-plus',
        source: 'trigger-1',
        target: 'plus-1',
      };
      setEdges([edge]);
    }, 100);
  }, []);

  // Add action node
  const addActionNode = useCallback((action: ActionService) => {
    const actionNode: Node = {
      id: `action-${Date.now()}`,
      type: 'action',
      position: { x: UI_CONSTANTS.DEFAULT_NODE_POSITION.x, y: UI_CONSTANTS.DEFAULT_NODE_POSITION.y + UI_CONSTANTS.NODE_SPACING },
      data: { 
        label: action.name,
        type: action.id,
        icon: action.icon,
        color: action.color,
        status: 'ready'
      },
    };
    
    // Remove plus nodes and add action node
    setNodes(prev => {
      const filtered = prev.filter(n => n.data.type !== 'plus');
      return [...filtered, actionNode];
    });
  }, []);

  // Update node status
  const updateNodeStatus = useCallback((nodeId: string, status: 'ready' | 'executing' | 'executed' | 'error') => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, status } }
        : node
    ));
  }, []);

  // Clear workflow
  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, []);

  // Update all nodes status
  const updateAllNodesStatus = useCallback((status: 'ready' | 'executing' | 'executed' | 'error') => {
    setNodes(prev => prev.map(node => ({
      ...node,
      data: { ...node.data, status }
    })));
  }, []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addTriggerNode,
    addActionNode,
    updateNodeStatus,
    updateAllNodesStatus,
    clearWorkflow
  };
};
