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
import { ThemeToggle } from './components/ThemeToggle';

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

  // Add a test node on component mount to verify rendering
  React.useEffect(() => {
    const testNode: Node = {
      id: 'test-node',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        label: 'Test Trigger',
        type: 'webhook',
        icon: '🔗',
        color: '#4F46E5',
        status: 'ready'
      }
    };
    setNodes([testNode]);
    console.log('Added test node:', testNode);
  }, []);

  
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
    console.log('Creating trigger node:', newNode);
    setNodes(prev => {
      const updated = [...prev, newNode];
      console.log('Updated nodes after trigger:', updated);
      return updated;
    });
  };

  const handleSelectAction = (action: ActionService) => {
    const newNode = createActionNode(action);
    console.log('Creating action node:', newNode);
    setNodes(prev => {
      const updated = [...prev, newNode];
      console.log('Updated nodes after action:', updated);
      return updated;
    });
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-gradient-success rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Premium Glass Header */}
      <header className="header relative z-10">
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-colored animate-glow">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-success rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-success rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">FlowCraft Studio</h1>
              <p className="text-sm text-muted-foreground">Professional Automation Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-muted/50 backdrop-blur-sm">
              <div className="status-indicator">
                <div className="ping bg-success"></div>
                <div className="dot bg-success"></div>
              </div>
              <span className="text-xs font-medium text-muted-foreground">System Online</span>
            </div>
            
            <ThemeToggle />
            
            <button 
              className="btn btn-ghost"
              onClick={() => setShowArchSummary(true)}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Docs
            </button>
            
            <div className="flex items-center space-x-2">
              <button 
                className="btn btn-primary relative overflow-hidden group"
                onClick={() => setShowTriggerModal(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="mr-2 h-4 w-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="relative z-10">Add Trigger</span>
              </button>
              
              <button 
                className="btn btn-secondary relative overflow-hidden group"
                onClick={() => setShowActionModal(true)}
              >
                <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="mr-2 h-4 w-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="relative z-10">Add Action</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Dashboard Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Floating Left Sidebar */}
        <aside className="w-80 p-6">
          <div className="card h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Workflow Canvas</h2>
                  <p className="text-sm text-muted-foreground">Build powerful automations</p>
                </div>
                <div className="status-indicator">
                  <div className="ping bg-success"></div>
                  <div className="dot bg-success"></div>
                </div>
              </div>
              
              {/* Premium Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="card-secondary">
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-gradient-primary text-white shadow-colored">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gradient">{nodes.filter(n => n.type === 'trigger').length}</p>
                        <p className="text-xs text-muted-foreground">Triggers</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-secondary">
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-gradient-success text-white shadow-colored">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gradient">{nodes.filter(n => n.type === 'action').length}</p>
                        <p className="text-xs text-muted-foreground">Actions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 overflow-y-auto">
                <WorkflowControlPanel
                  workflow={workflowData}
                  onSave={handleSaveWorkflow}
                  onExecute={handleExecuteWorkflow}
                  onClear={handleClearWorkflow}
                  isExecuting={isExecuting}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Premium Canvas Area */}
        <main className="flex-1 relative p-6">
          <div className="card h-full">
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={customNodeTypes}
                fitView
                className="rounded-xl"
                style={{
                  background: 'transparent'
                }}
              >
                <Background 
                  color="hsl(var(--muted-foreground) / 0.1)" 
                  gap={24} 
                  size={1.5}
                  variant={BackgroundVariant.Dots} 
                />
                <Controls 
                  className="!shadow-elegant !bg-card/80 !backdrop-blur-sm !border-border/50 !rounded-xl"
                  showZoom={true}
                  showFitView={true}
                  showInteractive={true}
                />
                <MiniMap 
                  className="!shadow-elegant !bg-card/80 !backdrop-blur-sm !border-border/50 !rounded-xl"
                  nodeColor={(node) => {
                    if (node.type === 'trigger') return 'hsl(var(--primary))';
                    if (node.type === 'action') return 'hsl(var(--success))';
                    if (node.type === 'condition') return 'hsl(var(--warning))';
                    return 'hsl(var(--muted-foreground))';
                  }}
                  nodeStrokeWidth={2}
                  pannable
                  zoomable
                />
              </ReactFlow>
            </div>
          </div>
        </main>

        {/* Floating Right Sidebar */}
        <aside className="w-80 p-6">
          <div className="card h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Execution Monitor</h2>
                  <p className="text-sm text-muted-foreground">Real-time workflow insights</p>
                </div>
                <div className={`status-indicator ${isExecuting ? 'animate-pulse' : ''}`}>
                  <div className={`ping ${isExecuting ? 'bg-warning' : 'bg-success'}`}></div>
                  <div className={`dot ${isExecuting ? 'bg-warning' : 'bg-success'}`}></div>
                </div>
              </div>
              
              <div className="space-y-6 overflow-y-auto">
                <ExecutionPanel
                  executionResults={executionResults}
                  isExecuting={isExecuting}
                />
              </div>
            </div>
          </div>
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

