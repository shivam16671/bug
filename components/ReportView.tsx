
import React, { useState } from 'react';
import { WebReport } from '../types';
import BugCard from './BugCard';

interface ReportViewProps {
  report: WebReport;
  onReset: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, onReset }) => {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleEmailReport = () => {
    setEmailStatus('sending');
    // Simulate email sending
    setTimeout(() => {
      setEmailStatus('sent');
      const subject = encodeURIComponent(`Bug Report: ${report.url}`);
      const body = encodeURIComponent(
        `Website Scan Report for ${report.url}\n` +
        `Scan Date: ${report.scanDate}\n` +
        `Score: ${report.score}/100\n\n` +
        `Summary: ${report.summary}\n\n` +
        `Found ${report.bugs.length} potential issues.\n\n` +
        `View the full report at our platform.`
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      
      setTimeout(() => setEmailStatus('idle'), 3000);
    }, 1500);
  };

  const criticalCount = report.bugs.filter(b => b.severity === 'Critical').length;
  const highCount = report.bugs.filter(b => b.severity === 'High').length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-700">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Scanner
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
          >
            <i className="fa-solid fa-print"></i>
            Print PDF
          </button>
          <button 
            onClick={handleEmailReport}
            disabled={emailStatus !== 'idle'}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium disabled:opacity-70"
          >
            {emailStatus === 'idle' && <><i className="fa-solid fa-envelope"></i> Email Report</>}
            {emailStatus === 'sending' && <><i className="fa-solid fa-spinner fa-spin"></i> Preparing...</>}
            {emailStatus === 'sent' && <><i className="fa-solid fa-check"></i> Opened Client</>}
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-8">
          <div className="relative flex-shrink-0">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-100"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * report.score) / 100}
                className={`${report.score > 80 ? 'text-green-500' : report.score > 50 ? 'text-yellow-500' : 'text-red-500'}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{report.score}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Health Score</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 break-all">{report.url}</h1>
            <p className="text-gray-500 text-sm mb-4">Scan completed on {report.scanDate}</p>
            <div className="flex gap-4">
               <div className="flex flex-col">
                  <span className="text-xl font-bold text-red-600">{criticalCount}</span>
                  <span className="text-xs text-gray-400 uppercase font-bold">Critical</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xl font-bold text-orange-500">{highCount}</span>
                  <span className="text-xs text-gray-400 uppercase font-bold">High Risk</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-700">{report.bugs.length}</span>
                  <span className="text-xs text-gray-400 uppercase font-bold">Total Bugs</span>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-indigo-600 p-8 rounded-2xl text-white shadow-xl shadow-indigo-100 flex flex-col justify-center">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <i className="fa-solid fa-quote-left opacity-50"></i>
            Executive Summary
          </h2>
          <p className="text-indigo-100 leading-relaxed text-sm italic">
            "{report.summary}"
          </p>
        </div>
      </div>

      {/* Bug Listing */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          Detailed Findings
          <span className="bg-gray-100 text-gray-500 text-sm px-3 py-1 rounded-full">{report.bugs.length}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.bugs.map((bug) => (
            <BugCard key={bug.id} bug={bug} />
          ))}
        </div>
      </div>
      
      {report.bugs.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <i className="fa-solid fa-circle-check text-green-500 text-5xl mb-4"></i>
          <h3 className="text-xl font-bold text-gray-900">No major bugs detected!</h3>
          <p className="text-gray-500">The heuristic scan didn't find any common patterns for concern.</p>
        </div>
      )}
    </div>
  );
};

export default ReportView;
