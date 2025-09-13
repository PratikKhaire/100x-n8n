import React from 'react';
import { WorkflowData } from '../../types/workflow';

interface WorkflowControlPanelProps {
  workflow: WorkflowData;
  onSave: () => void;
  onExecute: () => void;
  onClear: () => void;
  isExecuting: boolean;
}

export const WorkflowControlPanel: React.FC<WorkflowControlPanelProps> = ({
  workflow,
  onSave,
  onExecute,
  onClear,
  isExecuting
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Panel Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            ⚙️
          </span>
          <span>Workflow Controls</span>
        </h3>
      </div>
      
      {/* Workflow Info Cards */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Workflow Name</p>
              <p className="text-lg font-semibold text-blue-800">{workflow.name || 'Untitled Workflow'}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white">📋</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{workflow.nodes.length}</p>
              <p className="text-sm text-green-800 font-medium">Nodes</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{workflow.edges.length}</p>
              <p className="text-sm text-purple-800 font-medium">Connections</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Control Buttons */}
      <div className="space-y-3">
        <button 
          className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
          onClick={onSave}
          disabled={workflow.nodes.length === 0}
        >
          <span>💾</span>
          <span>Save Workflow</span>
        </button>
        
        <button 
          className={`w-full flex items-center justify-center space-x-2 py-3 ${
            isExecuting 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white animate-pulse-subtle' 
              : 'btn-success'
          }`}
          onClick={onExecute}
          disabled={workflow.nodes.length === 0 || isExecuting}
        >
          {isExecuting ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>Executing...</span>
            </>
          ) : (
            <>
              <span>▶️</span>
              <span>Execute Workflow</span>
            </>
          )}
        </button>
        
        <button 
          className="w-full btn-danger flex items-center justify-center space-x-2 py-3"
          onClick={onClear}
          disabled={workflow.nodes.length === 0}
        >
          <span>🗑️</span>
          <span>Clear All</span>
        </button>
      </div>
      
      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${workflow.nodes.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            {workflow.nodes.length > 0 ? 'Ready' : 'Empty'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Complexity:</span>
          <span className="font-medium text-blue-600">
            {workflow.nodes.length === 0 ? 'None' : 
             workflow.nodes.length < 3 ? 'Simple' : 
             workflow.nodes.length < 6 ? 'Medium' : 'Complex'}
          </span>
        </div>
      </div>
    </div>
  );
};
