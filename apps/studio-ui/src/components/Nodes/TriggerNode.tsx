import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { TriggerNodeProps } from '../../types/workflow';

export const TriggerNode: React.FC<TriggerNodeProps> = ({ data }) => (
  <div className={`relative bg-white rounded-xl shadow-medium hover:shadow-strong transition-all duration-200 border-2 min-w-[200px] ${
    data.status === 'ready' ? 'border-gray-200' :
    data.status === 'executing' ? 'border-yellow-400 ring-4 ring-yellow-100' :
    data.status === 'executed' ? 'border-green-400 ring-4 ring-green-100' :
    'border-red-400 ring-4 ring-red-100'
  }`}>
    {/* Status indicator */}
    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white shadow-soft flex items-center justify-center text-xs ${
      data.status === 'ready' ? 'bg-gray-400' :
      data.status === 'executing' ? 'bg-yellow-500 animate-pulse' :
      data.status === 'executed' ? 'bg-green-500' :
      'bg-red-500'
    }`}>
      {data.status === 'ready' ? '⏸️' :
       data.status === 'executing' ? '⏳' :
       data.status === 'executed' ? '✅' : '❌'}
    </div>

    {/* Header */}
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl p-4 text-white">
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center shadow-soft"
          style={{ backgroundColor: data.color }}
        >
          <span className="text-lg">{data.icon}</span>
        </div>
        <div>
          <h3 className="font-semibold text-sm">TRIGGER</h3>
          <p className="text-blue-100 text-xs">Workflow starter</p>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-4">
      <h4 className="font-semibold text-gray-900 mb-1">{data.label}</h4>
      <p className="text-sm text-gray-600 mb-3">{data.type}</p>
      
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          data.status === 'ready' ? 'bg-gray-100 text-gray-700' :
          data.status === 'executing' ? 'bg-yellow-100 text-yellow-800' :
          data.status === 'executed' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </span>
        
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-subtle"></div>
      </div>
    </div>

    {/* Handles */}
    <Handle type="source" position={Position.Right} className="!w-4 !h-4 !bg-blue-500 !border-2 !border-white hover:!w-5 hover:!h-5 transition-all" />
  </div>
);