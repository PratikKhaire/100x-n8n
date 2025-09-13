import { useState, useCallback } from 'react';
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
  BackgroundVariant,
  Panel,
  Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';

// Enhanced Trigger Types with more options
const triggerTypes = [
  { id: 'manual', name: 'Manual Trigger', description: 'Start workflow manually', icon: '▶️', color: '#4299e1' },
  { id: 'webhook', name: 'Webhook', description: 'HTTP webhook trigger', icon: '🔗', color: '#48bb78' },
  { id: 'schedule', name: 'Schedule', description: 'Time-based trigger', icon: '⏰', color: '#ed8936' },
  { id: 'email', name: 'Email', description: 'Email received trigger', icon: '📧', color: '#9f7aea' }
];

// Enhanced Action Services
const actionServices = [
  { id: 'http', name: 'HTTP Request', description: 'Make HTTP API calls', icon: '🌐', color: '#4299e1' },
  { id: 'email', name: 'Send Email', description: 'Send email notifications', icon: '📧', color: '#ed8936' },
  { id: 'database', name: 'Database', description: 'Database operations', icon: '🗄️', color: '#48bb78' },
  { id: 'telegram', name: 'Telegram', description: 'Send Telegram messages', icon: '📱', color: '#0088cc' },
  { id: 'slack', name: 'Slack', description: 'Send Slack messages', icon: '💬', color: '#4a154b' },
  { id: 'transform', name: 'Transform Data', description: 'Data transformation', icon: '🔄', color: '#9f7aea' }
];

// Custom Node Components
const TriggerNode = ({ data }: { data: any }) => (
  <div className={`custom-node trigger-node ${data.status || 'ready'}`}>
    <div className="node-icon" style={{ backgroundColor: data.color }}>{data.icon}</div>
    <div className="node-content">
      <div className="node-title">{data.label}</div>
      <div className="node-subtitle">{data.type}</div>
    </div>
    <div className="node-status">{data.status || 'Ready'}</div>
  </div>
);

const ActionNode = ({ data }: { data: any }) => (
  <div className={`custom-node action-node ${data.status || 'ready'}`}>
    <div className="node-icon" style={{ backgroundColor: data.color }}>{data.icon}</div>
    <div className="node-content">
      <div className="node-title">{data.label}</div>
      <div className="node-subtitle">{data.type}</div>
    </div>
    <div className="node-status">{data.status || 'Ready'}</div>
  </div>
);

const ConditionNode = ({ data }: { data: any }) => (
  <div className="custom-node condition-node">
    <div className="node-icon">❓</div>
    <div className="node-content">
      <div className="node-title">{data.label || 'IF Condition'}</div>
      <div className="node-subtitle">Boolean Logic</div>
    </div>
    <div className="condition-outputs">
      <div className="output true">True</div>
      <div className="output false">False</div>
    </div>
  </div>
);

const customNodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

// Initial empty state
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function App() {
  // Core ReactFlow state
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [response, setResponse] = useState('');
  
  // Modal states
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showWorkflowSettings, setShowWorkflowSettings] = useState(false);
  
  // Workflow metadata
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<any[]>([]);

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

  // Start workflow creation
  const addFirstStep = () => {
    setShowTriggerModal(true);
  };

  // Add trigger node
  const handleTriggerSelect = (trigger: any) => {
    const triggerNode: Node = {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 250, y: 100 },
      data: { 
        label: trigger.name,
        type: trigger.id,
        icon: trigger.icon,
        color: trigger.color,
        status: 'Ready'
      },
    };
    
    setNodes([triggerNode]);
    setShowTriggerModal(false);
    
    // Auto-add a plus node for the next step
    setTimeout(() => {
      const plusNode: Node = {
        id: 'plus-1',
        type: 'default',
        position: { x: 250, y: 250 },
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
  };

  // Handle action selection
  const handleActionSelect = (action: any) => {
    const actionNode: Node = {
      id: `action-${Date.now()}`,
      type: 'action',
      position: { x: 250, y: 250 },
      data: { 
        label: action.name,
        type: action.id,
        icon: action.icon,
        color: action.color,
        status: 'Ready'
      },
    };
    
    // Remove plus nodes and add action node
    setNodes(prev => {
      const filtered = prev.filter(n => n.data.type !== 'plus');
      return [...filtered, actionNode];
    });
    
    setShowActionModal(false);
  };

  // Node click handler
  const onNodeClick = (event: any, node: Node) => {
    if (node.data.type === 'plus') {
      setShowActionModal(true);
    }
  };

  // Save workflow
  const saveWorkflow = async () => {
    try {
      const workflowData = {
        name: workflowName,
        nodes: JSON.stringify(nodes),
        edges: JSON.stringify(edges)
      };
      
      const res = await fetch('http://localhost:3002/api/v1/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      });
      
      if (res.ok) {
        setResponse('✅ Workflow saved successfully!');
      } else {
        throw new Error('Failed to save workflow');
      }
    } catch (error: any) {
      setResponse(`❌ Error saving: ${error.message}`);
    }
  };

  // Execute workflow
  const executeWorkflow = async () => {
    setIsExecuting(true);
    try {
      const workflowData = { nodes, edges };
      const res = await fetch('http://localhost:3002/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      });
      
      const data = await res.json();
      setResponse(`✅ Execution completed: ${JSON.stringify(data, null, 2)}`);
      setExecutionHistory(prev => [...prev, { timestamp: new Date(), result: data }]);
      
      // Update node statuses
      setNodes(prev => prev.map(node => ({
        ...node,
        data: { ...node.data, status: 'Executed' }
      })));
      
    } catch (error: any) {
      setResponse(`❌ Execution failed: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Clear workflow
  const clearWorkflow = () => {
    setNodes([]);
    setEdges([]);
    setResponse('');
    setExecutionHistory([]);
  };

  return (
    <div className="studio-container">
      <div className="studio-header">
        <h1>🚀 8n8 Workflow Builder</h1>
        <p>Create powerful automation workflows with drag-and-drop simplicity</p>
      </div>

      {/* Workflow Editor */}
      <div className="workflow-editor">
        {nodes.length === 0 ? (
          <div className="empty-state">
            <div className="add-first-step" onClick={addFirstStep}>
              <div className="plus-circle">+</div>
              <p>Add first step to start building your workflow</p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={customNodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                if (node.type === 'trigger') return '#4299e1';
                if (node.type === 'action') return '#48bb78';
                if (node.type === 'condition') return '#9f7aea';
                return '#718096';
              }}
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            
            {/* Workflow Control Panel */}
            <Panel position="top-left">
              <div className="workflow-panel">
                <h3>{workflowName}</h3>
                <div className="panel-buttons">
                  <button 
                    className="panel-btn save" 
                    onClick={saveWorkflow}
                    disabled={nodes.length === 0}
                  >
                    💾 Save
                  </button>
                  <button 
                    className="panel-btn execute" 
                    onClick={executeWorkflow}
                    disabled={nodes.length === 0 || isExecuting}
                  >
                    {isExecuting ? '⏳ Running...' : '▶️ Execute'}
                  </button>
                  <button 
                    className="panel-btn clear" 
                    onClick={clearWorkflow}
                  >
                    🗑️ Clear
                  </button>
                </div>
              </div>
            </Panel>

            {/* Execution Status Panel */}
            {executionHistory.length > 0 && (
              <Panel position="bottom-right">
                <div className="execution-panel">
                  <h4>Recent Executions</h4>
                  <div className="execution-list">
                    {executionHistory.slice(-3).map((exec, idx) => (
                      <div key={idx} className="execution-item">
                        <span className="exec-time">
                          {exec.timestamp.toLocaleTimeString()}
                        </span>
                        <span className="exec-status">✅</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            )}
          </ReactFlow>
        )}
      </div>

      {/* Trigger Selection Modal */}
      {showTriggerModal && (
        <div className="modal-overlay">
          <div className="modal-content trigger-modal">
            <div className="modal-header">
              <h2>🚀 Choose a Trigger</h2>
              <p>Select what starts your workflow</p>
              <button className="close-btn" onClick={() => setShowTriggerModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="trigger-grid">
                {triggerTypes.map((trigger) => (
                  <div
                    key={trigger.id}
                    className="trigger-card"
                    onClick={() => handleTriggerSelect(trigger)}
                  >
                    <div className="trigger-icon" style={{ backgroundColor: trigger.color }}>
                      {trigger.icon}
                    </div>
                    <h3>{trigger.name}</h3>
                    <p>{trigger.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Selection Modal */}
      {showActionModal && (
        <div className="modal-overlay">
          <div className="modal-content action-modal">
            <div className="modal-header">
              <h2>⚡ Choose an Action</h2>
              <p>Select what your workflow should do</p>
              <button className="close-btn" onClick={() => setShowActionModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="action-grid">
                {actionServices.map((action) => (
                  <div
                    key={action.id}
                    className="action-card"
                    onClick={() => handleActionSelect(action)}
                  >
                    <div className="action-icon" style={{ backgroundColor: action.color }}>
                      {action.icon}
                    </div>
                    <h3>{action.name}</h3>
                    <p>{action.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug/Response Section */}
      <div className="debug-section">
        <h3>🔍 Workflow Status</h3>
        <div className="status-grid">
          <div className="status-card">
            <h4>Nodes</h4>
            <span className="status-count">{nodes.length}</span>
          </div>
          <div className="status-card">
            <h4>Connections</h4>
            <span className="status-count">{edges.length}</span>
          </div>
          <div className="status-card">
            <h4>Executions</h4>
            <span className="status-count">{executionHistory.length}</span>
          </div>
        </div>
        
        {response && (
          <div className="response-container">
            <h4>Latest Response:</h4>
            <pre>{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
