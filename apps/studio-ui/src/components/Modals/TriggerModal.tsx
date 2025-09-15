import React from 'react';
import { TRIGGERS } from '../../utils/constants';
import { TriggerType } from '../../types/workflow';

interface TriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrigger: (trigger: TriggerType) => void;
}

export const TriggerModal: React.FC<TriggerModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTrigger 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="card w-full max-w-4xl max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Select a Trigger</h2>
                <p className="text-primary-foreground/80">Choose how your workflow starts</p>
              </div>
            </div>
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
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
            {TRIGGERS.map((trigger) => (
              <button
                key={trigger.id}
                className="group text-left p-6 border border-border rounded-xl bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-medium hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => {
                  onSelectTrigger(trigger);
                  onClose();
                }}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-xl shadow-soft transition-shadow group-hover:shadow-medium"
                    style={{ backgroundColor: trigger.color }}
                  >
                    {trigger.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent-foreground transition-colors">
                      {trigger.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                      {trigger.description}
                    </p>
                    <div className="mt-3 flex items-center text-xs">
                      <span className="bg-muted group-hover:bg-accent-foreground/10 px-2 py-1 rounded transition-colors">
                        Trigger
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
