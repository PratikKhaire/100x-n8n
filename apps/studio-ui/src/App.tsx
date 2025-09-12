import React, { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge, 
  NodeChange, 
  EdgeChange,
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define node types for different services
const nodeTypes = {
  httpService: 'HTTP Service',
  database: 'Database',
  webhook: 'Webhook',
  email: 'Email Service',
  scheduler: 'Scheduler'
};

// Initial nodes with different service types
const initialNodes: Node[] = [
  { 
    id: 'start', 
    position: { x: 250, y: 50 }, 
    data: { label: 'Start', type: 'start' },
    type: 'input',
    style: { background: '#4ade80', color: 'white', border: '2px solid #22c55e' }
  },
  { 
    id: 'http-1', 
    position: { x: 100, y: 150 }, 
    data: { label: 'HTTP Request', type: 'http', service: 'API Call' },
    style: { background: '#3b82f6', color: 'white', border: '2px solid #2563eb' }
  },
  { 
    id: 'db-1', 
    position: { x: 400, y: 150 }, 
    data: { label: 'Database Query', type: 'database', service: 'MySQL' },
    style: { background: '#f59e0b', color: 'white', border: '2px solid #d97706' }
  },
  { 
    id: 'end', 
    position: { x: 250, y: 250 }, 
    data: { label: 'End', type: 'end' },
    type: 'output',
    style: { background: '#ef4444', color: 'white', border: '2px solid #dc2626' }
  }
];

const initialEdges: Edge[] = [];

 export default function App() {
  const [workflowText, setWorkflowText] = useState('{"nodes": [], "connections": []}');
  const [response, setResponse] = useState('');
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  
  // Node change handler
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Edge change handler
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Connection handler
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Add new node function
  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: { 
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Service`,
        type: type 
      },
      style: getNodeStyle(type)
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Get node styling based on type
  const getNodeStyle = (type: string) => {
    const styles: Record<string, any> = {
      http: { background: '#3b82f6', color: 'white', border: '2px solid #2563eb' },
      database: { background: '#f59e0b', color: 'white', border: '2px solid #d97706' },
      webhook: { background: '#8b5cf6', color: 'white', border: '2px solid #7c3aed' },
      email: { background: '#ec4899', color: 'white', border: '2px solid #db2777' },
      scheduler: { background: '#10b981', color: 'white', border: '2px solid #059669' },
    };
    return styles[type] || { background: '#6b7280', color: 'white', border: '2px solid #4b5563' };
  };

  // Convert ReactFlow data to workflow format
  const generateWorkflowFromFlow = () => {
    const workflow = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.data.type,
        label: node.data.label,
        position: node.position
      })),
      connections: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target
      }))
    };
    setWorkflowText(JSON.stringify(workflow, null, 2));
  };
 

  const handleExecuteWorkflow = async () => {
    try {
      const workflowJson = JSON.parse(workflowText);
      const res = await fetch('http://localhost:3001/workflow/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowJson),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    }
  };

  return (
    <div className="studio-container">
      <h1>8n8 Studio UI - Workflow Builder</h1>
      <p>Build workflows by connecting different services and APIs</p>

      {/* Node Palette */}
      <div className="node-palette">
        <h3>Add Nodes:</h3>
        <button onClick={() => addNode('http')} className="node-button http">
          + HTTP Service
        </button>
        <button onClick={() => addNode('database')} className="node-button database">
          + Database
        </button>
        <button onClick={() => addNode('webhook')} className="node-button webhook">
          + Webhook
        </button>
        <button onClick={() => addNode('email')} className="node-button email">
          + Email Service
        </button>
        <button onClick={() => addNode('scheduler')} className="node-button scheduler">
          + Scheduler
        </button>
      </div>

      {/* Workflow Editor */}
      <div className="workflow-editor">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Controls */}
      <div className="controls-panel">
        <button onClick={generateWorkflowFromFlow} className="generate-button">
          Generate Workflow JSON
        </button>
        <button onClick={handleExecuteWorkflow} className="execute-button">
          Execute Workflow
        </button>
      </div>

      {/* Workflow JSON */}
      <div className="workflow-json">
        <h3>Workflow Definition (JSON):</h3>
        <textarea
          className="workflow-input"
          value={workflowText}
          onChange={(e) => setWorkflowText(e.target.value)}
          rows={10}
        />
      </div>

      {/* Backend Response */}
      <div className="response-section">
        <h3>Backend Response:</h3>
        <pre className="response-container">
          {response}
        </pre>
      </div>
    </div>
  );
}