# @8n8/engine

Core workflow execution engine for the 8n8 automation platform.

## Features

- TypeScript workflow execution
- JSON workflow parsing
- Extensible node system
- Type-safe workflow definitions

## Development

```bash
# Build the package
bun run build

# Watch for changes during development
bun run dev
```

## Usage

```typescript
import { executeWorkflow } from '@8n8/engine';

const workflow = {
  nodes: [],
  connections: []
};

const result = executeWorkflow(workflow);
console.log(result);
```

## API

### `executeWorkflow(workflowJson: any): string`

Executes a workflow from its JSON definition.

**Parameters:**
- `workflowJson` - The workflow definition object

**Returns:**
- `string` - Execution result message
