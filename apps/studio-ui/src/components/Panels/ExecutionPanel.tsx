import React from 'react';
import { ExecutionResult } from '../../types/workflow';

interface ExecutionPanelProps {
  executionResults: ExecutionResult[];
  isExecuting: boolean;
}

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  executionResults,
  isExecuting
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Panel Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              📊
            </span>
            <span>Execution Results</span>
          </div>
          {isExecuting && (
            <div className="flex items-center space-x-2 text-yellow-600">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
              <span className="text-sm font-medium">Running</span>
            </div>
          )}
        </h3>
      </div>
      
      {/* Results Content */}
      {executionResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No executions yet</h4>
          <p className="text-gray-500">Run your workflow to see results here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Recent Executions ({executionResults.length})
            </span>
            <span className="text-xs text-gray-500">Latest first</span>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {executionResults.map((result, index) => (
              <div 
                key={result.id || index}
                className={`rounded-lg border-l-4 bg-white p-4 shadow-soft transition-all duration-200 hover:shadow-medium ${
                  result.status === 'success' 
                    ? 'border-green-400 bg-green-50/50' 
                    : 'border-red-400 bg-red-50/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      result.status === 'success' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {result.status === 'success' ? '✅' : '❌'}
                    </span>
                    <span className={`text-sm font-semibold capitalize ${
                      result.status === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {result.message && (
                  <p className="text-sm text-gray-700 mb-3 font-medium">
                    {result.message}
                  </p>
                )}
                
                <details className="group">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
                    <span>View Details</span>
                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-3 p-3 bg-gray-50 rounded border overflow-x-auto">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Execution Stats */}
      {executionResults.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">Execution Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">
                {executionResults.filter(r => r.status === 'success').length}
              </p>
              <p className="text-green-800">Successful</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-red-600">
                {executionResults.filter(r => r.status === 'error').length}
              </p>
              <p className="text-red-800">Failed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
