import React from 'react';
import { ACTIONS } from '../../utils/constants';
import { ActionService } from '../../types/workflow';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: ActionService) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectAction 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="card w-full max-w-4xl max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Select an Action</h2>
                <p className="text-emerald-100">Choose what your workflow does</p>
              </div>
            </div>
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              onClick={onClose}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACTIONS.map((action) => (
              <button
                key={action.id}
                className="group text-left p-6 border border-border rounded-xl bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-medium hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => {
                  onSelectAction(action);
                  onClose();
                }}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-xl shadow-soft transition-shadow group-hover:shadow-medium"
                    style={{ backgroundColor: action.color }}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent-foreground transition-colors">
                      {action.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                      {action.description}
                    </p>
                    <div className="mt-3 flex items-center text-xs">
                      <span className="bg-muted group-hover:bg-accent-foreground/10 px-2 py-1 rounded transition-colors">
                        Action
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
