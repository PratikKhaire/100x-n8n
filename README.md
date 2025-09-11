# 8n8 - N8N Clone

A workflow automation platform built with TypeScript, similar to N8N.

## Project Structure

This is a Turborepo monorepo containing:

### Apps
- `server-main`: Express.js backend API server
- `studio-ui`: React frontend with visual workflow editor (ReactFlow)

### Packages  
- `@8n8/engine`: Core workflow execution engine

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (package manager)

### Installation

```bash
# Install dependencies
bun install

# Start all development servers
bun run dev
```

### Development URLs
- **Studio UI**: http://localhost:5173 (React app with workflow editor)
- **API Server**: http://localhost:3000 (Backend API)

## Available Scripts

```bash
# Start development servers for all apps
bun run dev

# Build all apps and packages
bun run build

# Run linting
bun run lint

# Format code
bun run format

# Clean all build artifacts and node_modules
bun run clean
```

## Features

- **Visual Workflow Editor**: Drag and drop interface using ReactFlow
- **REST API**: Express.js backend for workflow execution
- **TypeScript**: Full type safety across the codebase
- **Monorepo**: Turborepo for efficient development and builds
- **Hot Reload**: Fast development with Bun and Vite

## Architecture

- **Frontend**: React + ReactFlow for visual workflow building
- **Backend**: Express.js API server 
- **Engine**: Core workflow execution logic
- **Package Manager**: Bun for fast installs and runtime

## API Endpoints

- `GET /` - Health check
- `POST /workflow/execute` - Execute a workflow JSON

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
