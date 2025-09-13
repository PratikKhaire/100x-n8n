// Workflow Types
export interface TriggerType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ActionService {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  position: { x: number; y: number };
  data: {
    label: string;
    type: string;
    icon: string;
    color: string;
    status: 'ready' | 'executing' | 'executed' | 'error';
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowData {
  id?: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExecutionResult {
  id: string;
  timestamp: Date;
  status: 'success' | 'error';
  result: any;
  message?: string;
}

// Node-specific props for ReactFlow components
export interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    status?: 'ready' | 'executing' | 'executed' | 'error';
  };
}

export interface TriggerNodeProps extends BaseNodeProps {
  data: {
    label: string;
    type: string;
    icon: string;
    color: string;
    status: 'ready' | 'executing' | 'executed' | 'error';
  };
}

export interface ActionNodeProps extends BaseNodeProps {
  data: {
    label: string;
    type: string;
    icon: string;
    color: string;
    status: 'ready' | 'executing' | 'executed' | 'error';
  };
}

export interface ConditionNodeProps extends BaseNodeProps {
  data: {
    label: string;
    type: string;
    icon: string;
    color: string;
    status: 'ready' | 'executing' | 'executed' | 'error';
  };
}
