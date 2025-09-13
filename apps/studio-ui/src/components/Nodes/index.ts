import { TriggerNode } from './TriggerNode';
import { ActionNode } from './ActionNode';
import { ConditionNode } from './ConditionNode';

export { TriggerNode, ActionNode, ConditionNode };

// Export node types for ReactFlow
export const customNodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};
