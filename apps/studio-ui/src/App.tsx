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
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define trigger types
const triggerTypes = [
  { id: 'manual', name: 'Trigger manually', description: 'Runs the flow on clicking a button in n8n. Good for getting started quickly', icon: '▶️' },
  { id: 'app-event', name: 'On app event', description: 'Runs the flow when something happens in an app like Telegram, Notion or Airtable', icon: '📱' },
  { id: 'schedule', name: 'On a schedule', description: 'Runs the flow every day, hour, or custom interval', icon: '⏰' },
  { id: 'webhook', name: 'On webhook call', description: 'Runs the flow on receiving an HTTP request', icon: '🔗' },
  { id: 'form', name: 'On form submission', description: 'Generate webforms in n8n and pass their responses to the workflow', icon: '📝' },
  { id: 'workflow', name: 'When executed by another workflow', description: 'Runs the flow when called by the Execute Workflow node from a different workflow', icon: '🔄' }
];

// Define action services
const actionServices = [
  { id: 'telegram', name: 'Telegram', description: 'Send messages via Telegram', icon: '📞', color: '#0088cc' },
  { id: 'resend', name: 'Resend', description: 'Send emails via Resend', icon: '📧', color: '#000000' },
  { id: 'notion', name: 'Notion', description: 'Create and manage Notion pages', icon: '📝', color: '#000000' },
  { id: 'airtable', name: 'Airtable', description: 'Manage Airtable records', icon: '📊', color: '#18bfff' },
  { id: 'slack', name: 'Slack', description: 'Send Slack messages', icon: '💬', color: '#4a154b' },
  { id: 'discord', name: 'Discord', description: 'Send Discord messages', icon: '🎮', color: '#5865f2' }
];

// Initial empty state
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

 export default function App() {
  const [response, setResponse] = useState('');
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  
  // Modal states
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  
  // Webhook configuration state
  const [webhookConfig, setWebhookConfig] = useState({
    testUrl: '',
    productionUrl: '',
    httpMethod: 'GET',
    path: '',
    authentication: 'None',
    respond: 'Immediately'
  });
  
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

  // Add first step - show trigger selection
  const addFirstStep = () => {
    setShowTriggerModal(true);
  };

  // Handle trigger selection
  const handleTriggerSelect = (trigger: any) => {
    if (trigger.id === 'webhook') {
      setShowTriggerModal(false);
      setShowWebhookConfig(true);
    } else {
      // Add trigger node for other types
      addTriggerNode(trigger);
      setShowTriggerModal(false);
    }
  };

  // Add trigger node
  const addTriggerNode = (trigger: any) => {
    const newNode: Node = {
      id: `trigger-${Date.now()}`,
      position: { x: 250, y: 100 },
      data: { 
        label: trigger.name,
        type: trigger.id,
        icon: trigger.icon
      },
      style: { 
        background: '#fff', 
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '150px'
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Save webhook configuration
  const saveWebhookConfig = () => {
    const webhookNode: Node = {
      id: `webhook-${Date.now()}`,
      position: { x: 250, y: 100 },
      data: { 
        label: 'Webhook',
        type: 'webhook',
        icon: '🔗',
        config: webhookConfig
      },
      style: { 
        background: '#fff', 
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '150px'
      }
    };
    setNodes((nds) => [...nds, webhookNode]);
    setShowWebhookConfig(false);
    
    // Add the plus button node
    addPlusNode();
  };

  // Add plus button node for next action
  const addPlusNode = () => {
    const plusNode: Node = {
      id: `plus-${Date.now()}`,
      position: { x: 250, y: 250 },
      data: { 
        label: '+',
        type: 'plus'
      },
      style: { 
        background: '#f8f9fa', 
        border: '2px dashed #6c757d',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        cursor: 'pointer'
      }
    };
    setNodes((nds) => [...nds, plusNode]);
  };

  // Handle node click
  const onNodeClick = (_event: any, node: Node) => {
    if (node.data.type === 'plus') {
      setShowActionModal(true);
    }
  };

  // Handle action selection
  const handleActionSelect = (action: any) => {
    // Remove plus node and add action node
    setNodes((nds) => {
      const filteredNodes = nds.filter(n => n.data.type !== 'plus');
      const actionNode: Node = {
        id: `action-${Date.now()}`,
        position: { x: 250, y: 250 },
        data: { 
          label: action.name,
          type: action.id,
          icon: action.icon
        },
        style: { 
          background: '#fff', 
          border: `2px solid ${action.color}`,
          borderRadius: '8px',
          padding: '10px',
          minWidth: '150px'
        }
      };
      return [...filteredNodes, actionNode];
    });
    setShowActionModal(false);
  };
 

  const handleExecuteWorkflow = async () => {
    try {
      const workflowJson = { nodes, edges };
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

      {/* Empty State or Workflow Editor */}
      <div className="workflow-editor">
        {nodes.length === 0 ? (
          <div className="empty-state">
            <div className="add-first-step">
              <div className="plus-circle" onClick={addFirstStep}>
                +
              </div>
              <p>Add first step...</p>
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
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        )}
      </div>

      {/* Trigger Selection Modal */}
      {showTriggerModal && (
        <div className="modal-overlay">
          <div className="modal-content trigger-modal">
            <div className="modal-header">
              <h2>What triggers this workflow?</h2>
              <p>A trigger is a step that starts your workflow</p>
              <button className="close-button" onClick={() => setShowTriggerModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="search-box">
                <input type="text" placeholder="Search nodes..." />
              </div>
              <div className="trigger-list">
                {triggerTypes.map((trigger) => (
                  <div
                    key={trigger.id}
                    className="trigger-item"
                    onClick={() => handleTriggerSelect(trigger)}
                  >
                    <div className="trigger-icon">{trigger.icon}</div>
                    <div className="trigger-info">
                      <h3>{trigger.name}</h3>
                      <p>{trigger.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Configuration Modal */}
      {showWebhookConfig && (
        <div className="modal-overlay">
          <div className="modal-content webhook-modal">
            <div className="modal-header">
              <div className="webhook-icon">🔗</div>
              <h2>Webhook</h2>
              <button className="close-button" onClick={() => setShowWebhookConfig(false)}>
                ×
              </button>
            </div>
            <div className="webhook-tabs">
              <button className="tab active">Parameters</button>
              <button className="tab">Settings</button>
              <button className="tab">Docs</button>
            </div>
            <div className="modal-body">
              <div className="webhook-config">
                <div className="webhook-section">
                  <h3>Webhook URLs</h3>
                  <div className="url-inputs">
                    <div className="url-input">
                      <label>Test URL</label>
                      <div className="url-display">
                        <span className="method-tag">GET</span>
                        <input 
                          type="text" 
                          value={webhookConfig.testUrl || 'https://anand.app.n8n.cloud/webhook-test/97fd3f85-e4ce-499b-8df0-daaf741d862c'}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="url-input">
                      <label>Production URL</label>
                      <input 
                        type="text" 
                        placeholder="Production URL"
                        value={webhookConfig.productionUrl}
                        onChange={(e) => setWebhookConfig({...webhookConfig, productionUrl: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="webhook-section">
                  <label>HTTP Method</label>
                  <select 
                    value={webhookConfig.httpMethod}
                    onChange={(e) => setWebhookConfig({...webhookConfig, httpMethod: e.target.value})}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <div className="webhook-section">
                  <label>Path</label>
                  <input 
                    type="text" 
                    value={webhookConfig.path}
                    onChange={(e) => setWebhookConfig({...webhookConfig, path: e.target.value})}
                    placeholder="97fd3f85-e4ce-499b-8df0-daaf741d862c"
                  />
                </div>

                <div className="webhook-section">
                  <label>Authentication</label>
                  <select 
                    value={webhookConfig.authentication}
                    onChange={(e) => setWebhookConfig({...webhookConfig, authentication: e.target.value})}
                  >
                    <option value="None">None</option>
                    <option value="Header Auth">Header Auth</option>
                    <option value="Basic Auth">Basic Auth</option>
                  </select>
                </div>

                <div className="webhook-section">
                  <label>Respond</label>
                  <select 
                    value={webhookConfig.respond}
                    onChange={(e) => setWebhookConfig({...webhookConfig, respond: e.target.value})}
                  >
                    <option value="Immediately">Immediately</option>
                    <option value="When last node finishes">When last node finishes</option>
                  </select>
                </div>

                <div className="webhook-info">
                  <p>If you are sending back a response, add a "Content-Type" response header with the appropriate value to avoid unexpected behavior</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="save-button" onClick={saveWebhookConfig}>
                Listen for test event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Selection Modal */}
      {showActionModal && (
        <div className="modal-overlay">
          <div className="modal-content action-modal">
            <div className="modal-header">
              <h2>Choose an action</h2>
              <button className="close-button" onClick={() => setShowActionModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="search-box">
                <input type="text" placeholder="Search actions..." />
              </div>
              <div className="action-grid">
                {actionServices.map((action) => (
                  <div
                    key={action.id}
                    className="action-item"
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

      {/* Debug/Testing Section */}
      <div className="debug-section">
        <h3>Debug Information</h3>
        <div className="workflow-json">
          <h4>Workflow JSON:</h4>
          <textarea
            className="workflow-input"
            value={JSON.stringify({ nodes, edges }, null, 2)}
            readOnly
            rows={10}
          />
        </div>
        
        <div className="controls-panel">
          <button onClick={handleExecuteWorkflow} className="execute-button">
            Execute Workflow
          </button>
        </div>

        <div className="response-section">
          <h4>Backend Response:</h4>
          <pre className="response-container">
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
}