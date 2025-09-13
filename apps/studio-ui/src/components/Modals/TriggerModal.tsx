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
      <div className="bg-white rounded-2xl shadow-strong max-w-4xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Select a Trigger</h2>
                <p className="text-blue-100">Choose how your workflow starts</p>
              </div>
            </div>
            <button 
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              onClick={onClose}
            >
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRIGGERS.map((trigger) => (
              <div
                key={trigger.id}
                className="group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 transition-all duration-200 hover:shadow-medium hover:-translate-y-1"
                onClick={() => {
                  onSelectTrigger(trigger);
                  onClose();
                }}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-soft group-hover:shadow-medium transition-shadow"
                    style={{ backgroundColor: trigger.color }}
                  >
                    {trigger.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                      {trigger.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                      {trigger.description}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <span className="bg-gray-200 group-hover:bg-blue-200 px-2 py-1 rounded transition-colors">
                        Trigger
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
