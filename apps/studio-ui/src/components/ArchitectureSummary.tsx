import React from 'react';

interface ArchitectureSummaryProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ArchitectureSummary: React.FC<ArchitectureSummaryProps> = ({ 
  isVisible, 
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-strong max-w-6xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏗️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Modular Architecture Overview</h2>
                <p className="text-indigo-100">Understanding the modern codebase structure</p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-8">
          {/* What's Been Built */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center space-x-2">
              <span>📋</span>
              <span>What's Been Built</span>
            </h3>
            <p className="text-blue-800 mb-4">The monolithic App.tsx has been broken down into a modular architecture with:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">🧩 Components/</h4>
                <p className="text-sm text-blue-700">Reusable UI components (Nodes, Modals, Panels)</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">🔧 Hooks/</h4>
                <p className="text-sm text-blue-700">Custom React hooks for business logic</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📝 Types/</h4>
                <p className="text-sm text-blue-700">TypeScript interfaces and type definitions</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">🛠️ Utils/</h4>
                <p className="text-sm text-blue-700">Helper functions and constants</p>
              </div>
            </div>
          </section>

          {/* Key Benefits */}
          <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center space-x-2">
              <span>🎯</span>
              <span>Key Benefits</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Maintainability', desc: 'Each component has a single responsibility' },
                { title: 'Reusability', desc: 'Components can be used across the application' },
                { title: 'Testability', desc: 'Components can be tested in isolation' },
                { title: 'Scalability', desc: 'Easy to add new features and node types' },
                { title: 'Type Safety', desc: 'Full TypeScript coverage' },
                { title: 'Modern UX', desc: 'Tailwind CSS with modern design patterns' }
              ].map((benefit, index) => (
                <div key={index} className="bg-white/60 rounded-lg p-4 flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">{benefit.title}</h4>
                    <p className="text-sm text-green-700">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Current Components */}
          <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center space-x-2">
              <span>🧩</span>
              <span>Current Components</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: '🔗 Nodes', items: ['TriggerNode', 'ActionNode', 'ConditionNode'], color: 'blue' },
                { title: '📱 Modals', items: ['TriggerModal', 'ActionModal'], color: 'green' },
                { title: '📊 Panels', items: ['WorkflowControlPanel', 'ExecutionPanel'], color: 'purple' },
                { title: '🔧 Hooks', items: ['useWorkflowAPI', 'useWorkflowNodes'], color: 'orange' }
              ].map((section, index) => (
                <div key={index} className={`bg-white/60 rounded-lg p-4 border-l-4 border-${section.color}-400`}>
                  <h4 className="font-semibold text-gray-900 mb-3">{section.title}</h4>
                  <ul className="space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-700 flex items-center space-x-2">
                        <div className={`w-2 h-2 bg-${section.color}-400 rounded-full`}></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* How to Test */}
          <section className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
            <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center space-x-2">
              <span>🚀</span>
              <span>How to Test the Modern UI</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { step: '1', action: 'Add Trigger', desc: 'Click "Add Trigger" to see the modern trigger selection modal' },
                { step: '2', action: 'Add Action', desc: 'Click "Add Action" to see the enhanced action selection modal' },
                { step: '3', action: 'Connect Nodes', desc: 'Drag from handles to create smooth connections' },
                { step: '4', action: 'Save Workflow', desc: 'Use the modernized control panel to save your workflow' },
                { step: '5', action: 'Execute', desc: 'Run the workflow and see results in the enhanced execution panel' },
                { step: '6', action: 'Explore UI', desc: 'Notice the glass effects, shadows, and smooth animations' }
              ].map((item, index) => (
                <div key={index} className="bg-white/60 rounded-lg p-4 flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900">{item.action}</h4>
                    <p className="text-sm text-yellow-800">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Modern Features */}
          <section className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
            <h3 className="text-xl font-bold text-teal-900 mb-4 flex items-center space-x-2">
              <span>✨</span>
              <span>Modern UI Features</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid UI development' },
                { title: 'Glass Effects', desc: 'Backdrop blur and transparency for modern aesthetics' },
                { title: 'Smooth Animations', desc: 'CSS transitions and keyframe animations' },
                { title: 'Responsive Design', desc: 'Mobile-first approach with flexible layouts' },
                { title: 'Color Gradients', desc: 'Beautiful gradient backgrounds and accents' },
                { title: 'Interactive Elements', desc: 'Hover effects and state-based styling' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/60 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-teal-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-teal-700">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
