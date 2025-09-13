import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import custom hooks
import { useWorkflowAPI } from './hooks/useWorkflowAPI';

// Import utility functions
import { createTriggerNode, createActionNode, updateNodeStatus } from './utils/nodeUtils';

// Import components
import { customNodeTypes } from './components/Nodes';
import { TriggerModal, ActionModal } from './components/Modals';
import { WorkflowControlPanel, ExecutionPanel } from './components/Panels';
import { ArchitectureSummary } from './components/ArchitectureSummary';

// Import types
import { TriggerType, ActionService, ExecutionResult } from './types/workflow';

import './index.css';
import { useEffect } from 'react';

const App: React.FC = () => {
  // Core ReactFlow state
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  // Modal state
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showArchSummary, setShowArchSummary] = useState(false);
  
  // Execution state
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Custom hooks
  const { saveWorkflow, executeWorkflow } = useWorkflowAPI();

  
// Node deletion event handler
const handleDeleteNode = (event: Event) => {
  const customEvent = event as CustomEvent<{ nodeId: string }>;
  const { nodeId } = customEvent.detail;
  deleteNode(nodeId);
};

// Listen for node deletion event
useEffect(() => {
  window.addEventListener('deleteNode', handleDeleteNode);
  return () => {
    window.removeEventListener('deleteNode', handleDeleteNode);
  };
}, []);

//del node function
const deleteNode = useCallback((nodeId:string) =>{
  setNodes(prevNodes => prevNodes.filter(node=> node.id !== nodeId));
  setEdges(prevEdges => prevEdges.filter(edge=> edge.source !== nodeId && edge.target !== nodeId));
},[]);
  // ReactFlow event handlers
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  // Workflow management functions
  const handleSaveWorkflow = async () => {
    try {
      const workflowData = {
        name: 'My Workflow',
        description: 'Generated workflow',
        nodes: nodes.map(node => ({
          id: node.id,
          type: (node.type || 'action') as 'trigger' | 'action' | 'condition',
          position: node.position,
          data: {
            label: String(node.data.label || ''),
            type: String(node.data.type || ''),
            icon: String(node.data.icon || ''),
            color: String(node.data.color || ''),
            status: (node.data.status as 'ready' | 'executing' | 'executed' | 'error') || 'ready'
          }
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        }))
      };
      
      await saveWorkflow(workflowData);
      alert('Workflow saved successfully!');
    } catch (error) {
      alert('Failed to save workflow');
    }
  };

  const handleExecuteWorkflow = async () => {
    if (nodes.length === 0) return;
    
    setIsExecuting(true);
    
    // Update all nodes to executing status
    setNodes(currentNodes => 
      currentNodes.map(node => updateNodeStatus(node, 'executing'))
    );

    try {
      const workflowData = {
        name: 'Execution Test',
        nodes: nodes.map(node => ({
          id: node.id,
          type: (node.type || 'action') as 'trigger' | 'action' | 'condition',
          position: node.position,
          data: {
            label: String(node.data.label || ''),
            type: String(node.data.type || ''),
            icon: String(node.data.icon || ''),
            color: String(node.data.color || ''),
            status: (node.data.status as 'ready' | 'executing' | 'executed' | 'error') || 'ready'
          }
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        }))
      };

      const result = await executeWorkflow(workflowData);
      
      // Update nodes to success status
      setNodes(currentNodes => 
        currentNodes.map(node => updateNodeStatus(node, 'executed'))
      );

      // Add execution result
      const executionResult: ExecutionResult = {
        id: `exec-${Date.now()}`,
        timestamp: new Date(),
        status: 'success',
        result: result,
        message: 'Workflow executed successfully'
      };
      
      setExecutionResults(prev => [executionResult, ...prev]);
      
    } catch (error) {
      // Update nodes to error status
      setNodes(currentNodes => 
        currentNodes.map(node => updateNodeStatus(node, 'error'))
      );

      const executionResult: ExecutionResult = {
        id: `exec-${Date.now()}`,
        timestamp: new Date(),
        status: 'error',
        result: null,
        message: error instanceof Error ? error.message : 'Execution failed'
      };
      
      setExecutionResults(prev => [executionResult, ...prev]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setExecutionResults([]);
  };

  // Node creation handlers
  const handleSelectTrigger = (trigger: TriggerType) => {
    const newNode = createTriggerNode(trigger);
    setNodes(prev => [...prev, newNode]);
  };

  const handleSelectAction = (action: ActionService) => {
    const newNode = createActionNode(action);
    setNodes(prev => [...prev, newNode]);
  };

  // Create workflow data object for components
  const workflowData = {
    name: 'Current Workflow',
    nodes: nodes.map(node => ({
      id: node.id,
      type: (node.type || 'action') as 'trigger' | 'action' | 'condition',
      position: node.position,
      data: {
        label: String(node.data.label || ''),
        type: String(node.data.type || ''),
        icon: String(node.data.icon || ''),
        color: String(node.data.color || ''),
        status: (node.data.status as 'ready' | 'executing' | 'executed' | 'error') || 'ready'
      }
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target
    }))
  };

  return (


    // window.removeEventListener('deleteNode', handleDeleteNode);
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Modern Header */}
      <header className="glass-effect border-b border-gray-200/50 px-6 py-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-medium">
              <span className="text-white text-xl font-bold">🔗</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
              <p className="text-sm text-gray-500">Build powerful automation workflows</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              className="btn-info inline-flex items-center space-x-2"
              onClick={() => setShowArchSummary(true)}
            >
              <span>📋</span>
              <span>Architecture</span>
            </button>
            <button 
              className="btn-primary inline-flex items-center space-x-2"
              onClick={() => setShowTriggerModal(true)}
            >
              <span>⚡</span>
              <span>Add Trigger</span>
            </button>
            <button 
              className="btn-secondary inline-flex items-center space-x-2"
              onClick={() => setShowActionModal(true)}
            >
              <span>🎯</span>
              <span>Add Action</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 glass-effect border-r border-gray-200/50 overflow-y-auto">
          <WorkflowControlPanel
            workflow={workflowData}
            onSave={handleSaveWorkflow}
            onExecute={handleExecuteWorkflow}
            onClear={handleClearWorkflow}
            isExecuting={isExecuting}
          />
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 relative bg-white">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={customNodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Background 
              color="#e2e8f0" 
              gap={20} 
              size={1}
              variant={BackgroundVariant.Dots} 
            />
            <Controls 
              className="shadow-medium"
              showZoom={true}
              showFitView={true}
              showInteractive={true}
            />
            <MiniMap 
              className="shadow-medium"
              nodeColor={(node) => {
                if (node.type === 'trigger') return '#3b82f6';
                if (node.type === 'action') return '#10b981';
                if (node.type === 'condition') return '#f59e0b';
                return '#6b7280';
              }}
              nodeStrokeWidth={2}
              pannable
              zoomable
            />
          </ReactFlow>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 glass-effect border-l border-gray-200/50 overflow-y-auto">
          <ExecutionPanel
            executionResults={executionResults}
            isExecuting={isExecuting}
          />
        </aside>
      </div>

      {/* Modals */}
      <TriggerModal
        isOpen={showTriggerModal}
        onClose={() => setShowTriggerModal(false)}
        onSelectTrigger={handleSelectTrigger}
      />

      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onSelectAction={handleSelectAction}
      />

      <ArchitectureSummary
        isVisible={showArchSummary}
        onClose={() => setShowArchSummary(false)}
      />
    </div>
  );
};

export default App;

