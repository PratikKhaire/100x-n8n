import { useState } from 'react';
import { API_ENDPOINTS } from '../utils/constants';
import { WorkflowData, ExecutionResult } from '../types/workflow';

export const useWorkflowAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save workflow to backend
  const saveWorkflow = async (workflowData: Omit<WorkflowData, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WORKFLOWS.CREATE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workflowData.name,
          nodes: JSON.stringify(workflowData.nodes),
          edges: JSON.stringify(workflowData.edges)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save workflow');
      }
      
      const result = await response.json();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load workflows from backend
  const loadWorkflows = async (): Promise<WorkflowData[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WORKFLOWS.LIST}`);
      
      if (!response.ok) {
        throw new Error('Failed to load workflows');
      }
      
      const workflows = await response.json();
      return workflows;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Execute workflow
  const executeWorkflow = async (workflowData: { nodes: any[], edges: any[] }): Promise<ExecutionResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.WORKFLOWS.EXECUTE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute workflow');
      }
      
      const result = await response.json();
      
      return {
        id: `exec-${Date.now()}`,
        timestamp: new Date(),
        status: 'success',
        result: result,
        message: result.message
      };
    } catch (err: any) {
      setError(err.message);
      
      return {
        id: `exec-${Date.now()}`,
        timestamp: new Date(),
        status: 'error',
        result: null,
        message: err.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    saveWorkflow,
    loadWorkflows,
    executeWorkflow,
    clearError: () => setError(null)
  };
};
