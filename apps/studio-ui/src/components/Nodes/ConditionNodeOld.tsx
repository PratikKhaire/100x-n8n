import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ConditionNodeProps } from '../../types/workflow';

export const ConditionNode: React.FC<ConditionNodeProps> = ({ id, data }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const deleteEvent = new CustomEvent('deleteNode', { detail: { nodeId: id } });
    window.dispatchEvent(deleteEvent);
  };

  return (
    <div className={`card relative min-w-[200px] transition-all duration-200 hover:shadow-medium ${
      data.status === 'ready' ? 'border-border' :
      data.status === 'executing' ? 'border-amber-400 ring-2 ring-amber-100' :
      data.status === 'executed' ? 'border-emerald-400 ring-2 ring-emerald-100' :
      'border-red-400 ring-2 ring-red-100'
    }`}>
      
      {/* Delete button */}
      <button 
        onClick={handleDelete}
        className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs transition-colors hover:bg-destructive/90 shadow-soft"
        title="Delete condition"
      >
        ✕
      </button>

      {/* Status indicator */}
      <div className={`absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background text-xs shadow-soft ${
        data.status === 'ready' ? 'bg-muted-foreground' :
        data.status === 'executing' ? 'bg-amber-500 animate-pulse' :
        data.status === 'executed' ? 'bg-emerald-500' :
        'bg-destructive'
      }`}>
        {data.status === 'ready' ? '⏸' :
         data.status === 'executing' ? '⏳' :
         data.status === 'executed' ? '✓' : '✗'}
      </div>

      {/* Header */}
      <div className="bg-amber-600 text-white rounded-t-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
            <span className="text-lg">{data.icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">CONDITION</h3>
            <p className="text-amber-100 text-xs">Decision point</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card-content">
        <h4 className="font-semibold text-card-foreground mb-1">{data.label}</h4>
        <p className="text-sm text-muted-foreground mb-3">{data.type}</p>
        
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            data.status === 'ready' ? 'bg-muted text-muted-foreground' :
            data.status === 'executing' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
            data.status === 'executed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="!bg-amber-600 hover:!bg-amber-500" />
      <Handle type="source" position={Position.Top} className="!bg-emerald-600 hover:!bg-emerald-500" />
      <Handle type="source" position={Position.Bottom} className="!bg-red-600 hover:!bg-red-500" />
    </div>
  );
};
