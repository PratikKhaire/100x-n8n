# n8n-like Workflow Builder - Modular Architecture

## 📋 Overview

This project has been refactored into a clean, modular architecture that breaks down the complexity of a large monolithic component into smaller, manageable, and reusable pieces. The application is a visual workflow builder similar to n8n, built with React, TypeScript, and ReactFlow.

## 🏗️ Architecture Overview

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── Nodes/           # ReactFlow node components
│   │   ├── TriggerNode.tsx
│   │   ├── ActionNode.tsx
│   │   ├── ConditionNode.tsx
│   │   └── index.ts
│   ├── Modals/          # Modal components for user interaction
│   │   ├── TriggerModal.tsx
│   │   ├── ActionModal.tsx
│   │   └── index.ts
│   ├── Panels/          # Side panel components
│   │   ├── WorkflowControlPanel.tsx
│   │   ├── ExecutionPanel.tsx
│   │   └── index.ts
│   └── index.ts         # Main component exports
├── hooks/               # Custom React hooks
│   ├── useWorkflowNodes.ts
│   ├── useWorkflowAPI.ts
│   └── index.ts
├── types/               # TypeScript type definitions
│   └── workflow.ts
├── utils/               # Utility functions and constants
│   ├── constants.ts
│   └── nodeUtils.ts
├── App.tsx              # Main application component (modular)
├── App.css              # Original styles
└── ModularStyles.css    # New modular component styles
```

## 🧩 Component Architecture

### 1. **Node Components** (`/components/Nodes/`)
Individual ReactFlow node components that render different types of workflow elements:

- **TriggerNode**: Renders trigger nodes (webhooks, schedules, manual triggers)
- **ActionNode**: Renders action nodes (HTTP requests, email, database operations)
- **ConditionNode**: Renders conditional logic nodes with true/false outputs

**Key Features:**
- Type-safe props using TypeScript interfaces
- Consistent styling and behavior
- Handle integration for ReactFlow connections
- Status indicators (ready, executing, executed, error)

### 2. **Modal Components** (`/components/Modals/`)
Overlay components for user interactions:

- **TriggerModal**: Selection interface for trigger types
- **ActionModal**: Selection interface for action services

**Key Features:**
- Reusable modal structure
- Grid layout for service selection
- Click-outside-to-close functionality
- Responsive design

### 3. **Panel Components** (`/components/Panels/`)
Side panel components for workflow management:

- **WorkflowControlPanel**: Control buttons and workflow information
- **ExecutionPanel**: Real-time execution results and history

**Key Features:**
- Clean separation of concerns
- Real-time data display
- Responsive layout
- User-friendly information presentation

### 4. **Custom Hooks** (`/hooks/`)
Business logic abstraction:

- **useWorkflowAPI**: API operations (save, load, execute workflows)
- **useWorkflowNodes**: Node management and ReactFlow integration

**Key Features:**
- Centralized API logic
- Reusable state management
- Error handling
- Type-safe operations

### 5. **Utilities** (`/utils/`)
Helper functions and constants:

- **constants.ts**: Centralized configuration (triggers, actions, API endpoints)
- **nodeUtils.ts**: Node creation and manipulation utilities

**Key Features:**
- Single source of truth for configuration
- Reusable utility functions
- Type-safe node operations

## 🎯 Benefits of Modular Architecture

### 1. **Maintainability**
- Each component has a single responsibility
- Easy to locate and fix bugs
- Consistent code patterns

### 2. **Reusability**
- Components can be used across different parts of the app
- Easy to create new node types or modals
- Shared utility functions

### 3. **Testability**
- Components can be tested in isolation
- Mock dependencies easily
- Better test coverage

### 4. **Scalability**
- Easy to add new features
- Clear separation of concerns
- Modular imports reduce bundle size

### 5. **Developer Experience**
- Clear file organization
- TypeScript intellisense
- Self-documenting code structure

## 🔄 Data Flow

```
App.tsx (Main State)
    ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Control Panel  │    │   ReactFlow     │    │ Execution Panel │
│                 │    │                 │    │                 │
│ - Save          │    │ - Nodes         │    │ - Results       │
│ - Execute       │    │ - Edges         │    │ - History       │
│ - Clear         │    │ - Connections   │    │ - Status        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
    ↓                         ↓                         ↑
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Modals      │    │  Node Components │    │   API Hooks     │
│                 │    │                 │    │                 │
│ - TriggerModal  │    │ - TriggerNode   │    │ - useWorkflowAPI│
│ - ActionModal   │    │ - ActionNode    │    │ - HTTP requests │
│                 │    │ - ConditionNode │    │ - Error handling│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 How to Extend

### Adding a New Node Type

1. **Create the Node Component**:
   ```tsx
   // components/Nodes/CustomNode.tsx
   import React from 'react';
   import { Handle, Position } from '@xyflow/react';
   import { CustomNodeProps } from '../../types/workflow';

   export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => (
     <div className="custom-node">
       {/* Your node UI */}
       <Handle type="target" position={Position.Left} />
       <Handle type="source" position={Position.Right} />
     </div>
   );
   ```

2. **Add to Node Types**:
   ```tsx
   // components/Nodes/index.ts
   export const customNodeTypes = {
     trigger: TriggerNode,
     action: ActionNode,
     condition: ConditionNode,
     custom: CustomNode, // Add your new node
   };
   ```

3. **Update Types**:
   ```tsx
   // types/workflow.ts
   export interface CustomNodeProps extends BaseNodeProps {
     data: {
       // Define your node data structure
     };
   }
   ```

### Adding a New Modal

1. **Create Modal Component**:
   ```tsx
   // components/Modals/CustomModal.tsx
   export const CustomModal: React.FC<CustomModalProps> = ({ 
     isOpen, onClose, onSelect 
   }) => {
     // Your modal implementation
   };
   ```

2. **Export and Use**:
   ```tsx
   // components/Modals/index.ts
   export { CustomModal } from './CustomModal';
   ```

## 🎨 Styling Strategy

The project uses a hybrid approach:
- **App.css**: Original application styles
- **ModularStyles.css**: New component-specific styles
- **Consistent Design System**: Shared colors, spacing, and component patterns

### Key Style Classes:
- `.btn`, `.btn-primary`, `.btn-secondary` - Button system
- `.modal-overlay`, `.modal-content` - Modal system
- `.custom-node`, `.node-icon`, `.node-content` - Node system
- `.panel-header`, `.control-buttons` - Panel system

## 🧪 Testing Strategy

Each component can be tested independently:

```tsx
// Example test for TriggerNode
import { render } from '@testing-library/react';
import { TriggerNode } from './TriggerNode';

test('renders trigger node with correct data', () => {
  const mockData = {
    label: 'Test Trigger',
    type: 'webhook',
    icon: '🔗',
    color: '#4F46E5',
    status: 'ready'
  };
  
  render(<TriggerNode id="1" data={mockData} />);
  // Test assertions
});
```

## 📝 Migration Notes

The refactoring process involved:

1. **Extracted Components**: Moved UI elements into separate, reusable components
2. **Created Custom Hooks**: Abstracted business logic into custom hooks
3. **Defined Types**: Added comprehensive TypeScript interfaces
4. **Centralized Constants**: Moved configuration to a constants file
5. **Added Utilities**: Created helper functions for common operations

### Before vs After:

**Before**: One large App.tsx file (~500+ lines) with all logic mixed together
**After**: Modular structure with ~50 files, each with a specific purpose

## 🔧 Configuration

Key configuration files:
- `utils/constants.ts` - Triggers, actions, and API endpoints
- `types/workflow.ts` - TypeScript type definitions
- `ModularStyles.css` - Component styling

## 🚦 Current Status

✅ **Completed**:
- Modular component architecture
- TypeScript type safety
- Custom hooks for business logic
- Responsive UI components
- Error handling and loading states

🔄 **In Progress**:
- Component testing suite
- Advanced node configuration
- Workflow persistence

🎯 **Future Enhancements**:
- Drag-and-drop from sidebar
- Node configuration panels
- Advanced condition logic
- Workflow templates
- Real-time collaboration

---

This modular architecture provides a solid foundation for building and maintaining a complex workflow builder application while keeping the codebase organized, testable, and scalable.
