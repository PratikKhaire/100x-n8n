import React, { useState } from 'react';
import { useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
 
const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

 export default function App() {
  const [workflowText, setWorkflowText] = useState('{"nodes": [], "connections": []}');
  const [response, setResponse] = useState('');
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
 

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
      <h1>8n8 Studio UI (V0)</h1>
      <p>This is a very basic UI to test the backend connection.</p>

      <h2>Workflow Definition (JSON)</h2>
      <textarea
        className="workflow-input"
        value={workflowText}
        onChange={(e) => setWorkflowText(e.target.value)}
      ></textarea>
      <br />
      <button onClick={handleExecuteWorkflow} className="execute-button">
        Execute Workflow
      </button>

      <h2>Backend Response:</h2>
      <pre className="response-container">
        {response}
      </pre>

      <div className="workflow-editor">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </div>
    </div>
  );
}