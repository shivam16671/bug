
import React from 'react';
import { BugItem } from '../types';

interface BugCardProps {
  bug: BugItem;
}

const BugCard: React.FC<BugCardProps> = ({ bug }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Accessibility': return 'fa-universal-access';
      case 'Performance': return 'fa-bolt';
      case 'Security': return 'fa-shield-halved';
      case 'SEO': return 'fa-magnifying-glass';
      default: return 'fa-code';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <i className={`fa-solid ${getCategoryIcon(bug.category)}`}></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{bug.title}</h3>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{bug.category}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(bug.severity)}`}>
          {bug.severity}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {bug.description}
      </p>

      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
        <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-wrench text-indigo-500"></i>
          RECOMMENDED SOLUTION
        </h4>
        <p className="text-gray-700 text-sm italic mb-3">
          {bug.solution}
        </p>
        
        {bug.codeSnippet && (
          <div className="relative">
            <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-mono uppercase">Code</div>
            <pre className="bg-slate-900 text-slate-100 text-xs p-3 rounded overflow-x-auto font-mono">
              <code>{bug.codeSnippet}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugCard;
