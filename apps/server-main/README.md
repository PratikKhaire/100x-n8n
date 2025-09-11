# Server Main

The main API server for 8n8 workflow automation platform.

## Features

- Express.js REST API
- CORS enabled for frontend communication
- Workflow execution endpoints
- TypeScript with hot reload

## Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## API Endpoints

- `GET /` - Health check endpoint
- `POST /workflow/execute` - Execute a workflow from JSON

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `@8n8/engine` - Core workflow execution engine
