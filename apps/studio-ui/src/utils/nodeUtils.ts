import { Node } from '@xyflow/react';
import { TriggerType, ActionService } from '../types/workflow';

// Utility functions for creating nodes
export const createTriggerNode = (trigger: TriggerType): Node => {
  return {
    id: `trigger-${Date.now()}`,
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: {
      label: trigger.name,
      type: trigger.id,
      icon: trigger.icon,
      color: trigger.color,
      status: 'ready'
    }
  };
};

export const createActionNode = (action: ActionService): Node => {
  return {
    id: `action-${Date.now()}`,
    type: 'action',
    position: { x: 300, y: 100 },
    data: {
      label: action.name,
      type: action.id,
      icon: action.icon,
      color: action.color,
      status: 'ready'
    }
  };
};

export const updateNodeStatus = (node: Node, status: 'ready' | 'executing' | 'executed' | 'error'): Node => {
  return {
    ...node,
    data: {
      ...node.data,
      status
    }
  };
};
