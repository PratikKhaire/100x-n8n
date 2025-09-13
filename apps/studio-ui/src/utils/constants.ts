import { TriggerType, ActionService } from '../types/workflow';

// Trigger Types
export const TRIGGERS: TriggerType[] = [
  {
    id: 'webhook',
    name: 'Webhook',
    description: 'Trigger workflow via HTTP request',
    icon: '🔗',
    color: '#4F46E5'
  },
  {
    id: 'schedule',
    name: 'Schedule',
    description: 'Trigger workflow on schedule',
    icon: '⏰',
    color: '#059669'
  },
  {
    id: 'manual',
    name: 'Manual',
    description: 'Manually trigger workflow',
    icon: '👆',
    color: '#DC2626'
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Trigger on email received',
    icon: '📧',
    color: '#7C3AED'
  }
];

// Action Services
export const ACTIONS: ActionService[] = [
  {
    id: 'http-request',
    name: 'HTTP Request',
    description: 'Make HTTP API calls',
    icon: '🌐',
    color: '#0891B2'
  },
  {
    id: 'email-send',
    name: 'Send Email',
    description: 'Send email notifications',
    icon: '📤',
    color: '#EA580C'
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Database operations',
    icon: '🗄️',
    color: '#059669'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send Slack messages',
    icon: '💬',
    color: '#4A154B'
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Update spreadsheets',
    icon: '📊',
    color: '#34A853'
  }
];

// API Endpoints
export const API_ENDPOINTS = {
  WORKFLOWS: 'http://localhost:3002/api/workflows',
  EXECUTE: 'http://localhost:3002/api/execute'
};
