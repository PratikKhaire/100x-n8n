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
    <div className={`card-premium relative min-w-[280px] max-w-[320px] overflow-hidden group transition-all duration-500 hover:scale-105 hover:shadow-elegant ${
      data.status === 'ready' ? 'ring-1 ring-border/20' :
      data.status === 'executing' ? 'ring-2 ring-warning/50 shadow-warning' :
      data.status === 'executed' ? 'ring-2 ring-success/50 shadow-success' :
      'ring-2 ring-destructive/50 shadow-destructive'
    }`}>
      
      {/* Floating Action Buttons */}
      <div className="absolute -top-3 -right-3 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button 
          onClick={handleDelete}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-destructive/90 backdrop-blur-sm text-white text-sm transition-all duration-300 hover:bg-destructive hover:scale-110 shadow-elegant"
          title="Delete condition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Premium Status Badge */}
      <div className={`absolute -top-3 -left-3 z-20 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-background shadow-elegant transition-all duration-300 ${
        data.status === 'ready' ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white' :
        data.status === 'executing' ? 'bg-gradient-warning text-white animate-pulse' :
        data.status === 'executed' ? 'bg-gradient-success text-white animate-glow' :
        'bg-gradient-to-r from-red-500 to-red-600 text-white'
      }`}>
        {data.status === 'ready' ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : data.status === 'executing' ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ) : data.status === 'executed' ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      {/* Premium Header with Warning Gradient */}
      <div className="relative bg-gradient-warning text-white rounded-t-xl p-6 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        </div>
        
        <div className="relative flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-soft group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl filter drop-shadow-sm">{data.icon || '🔀'}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-sm tracking-wide uppercase opacity-90">CONDITION</h3>
              <div className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse"></div>
            </div>
            <p className="text-white/90 text-xs font-medium">Logic Branch</p>
          </div>
        </div>
      </div>

      {/* Premium Content Section */}
      <div className="card-content p-6 space-y-4">
        <div>
          <h4 className="font-bold text-foreground mb-2 text-lg">{data.label}</h4>
          <p className="text-muted-foreground text-sm">{data.type}</p>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
            data.status === 'ready' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
            data.status === 'executing' ? 'bg-gradient-warning text-white shadow-warning animate-pulse' :
            data.status === 'executed' ? 'bg-gradient-success text-white shadow-success' :
            'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-destructive'
          }`}>
            <div className="flex items-center space-x-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${
                data.status === 'executing' ? 'animate-pulse' : ''
              } ${
                data.status === 'ready' ? 'bg-slate-400' :
                data.status === 'executing' ? 'bg-white' :
                data.status === 'executed' ? 'bg-white' :
                'bg-white'
              }`}></div>
              <span className="capitalize">{data.status}</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground flex items-center space-x-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Logic</span>
          </div>
        </div>
        
        {/* Branch Preview */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
            <div className="h-2 w-2 rounded-full bg-gradient-success"></div>
            <span className="text-xs font-medium text-success">True</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-red-50 to-red-50 dark:from-red-950/20 dark:to-red-950/20">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
            <span className="text-xs font-medium text-red-600 dark:text-red-400">False</span>
          </div>
        </div>
      </div>

      {/* Premium Connection Handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-gradient-warning !border-2 !border-white !w-4 !h-4 !shadow-elegant hover:!scale-125 !transition-transform !duration-300" 
      />
      <Handle 
        type="source" 
        position={Position.Top}
        className="!bg-gradient-success !border-2 !border-white !w-4 !h-4 !shadow-elegant hover:!scale-125 !transition-transform !duration-300" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom}
        className="!bg-gradient-to-r !from-red-500 !to-red-600 !border-2 !border-white !w-4 !h-4 !shadow-elegant hover:!scale-125 !transition-transform !duration-300" 
      />
    </div>
  );
};
