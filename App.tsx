
import React, { useState } from 'react';
import { ScanStatus, WebReport } from './types';
import { analyzeWebsite } from './services/geminiService';
import ReportView from './components/ReportView';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ScanStatus>(ScanStatus.IDLE);
  const [report, setReport] = useState<WebReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Basic URL validation
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }

    setStatus(ScanStatus.FETCHING);
    setError(null);

    try {
      // Simulate fetching delay
      await new Promise(r => setTimeout(r, 1500));
      setStatus(ScanStatus.ANALYZING);
      
      const result = await analyzeWebsite(targetUrl);
      setReport(result);
      setStatus(ScanStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during scan.');
      setStatus(ScanStatus.ERROR);
    }
  };

  const resetScanner = () => {
    setStatus(ScanStatus.IDLE);
    setReport(null);
    setError(null);
    setUrl('');
  };

  if (status === ScanStatus.COMPLETED && report) {
    return <ReportView report={report} onReset={resetScanner} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-200 mb-6 rotate-3">
            <i className="fa-solid fa-bug-slash text-3xl"></i>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            WebBug <span className="text-indigo-600">Detector</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Paste any website URL to detect bugs, accessibility issues, and security vulnerabilities with AI.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-indigo-100 border border-white">
          <form onSubmit={handleScan} className="space-y-6">
            <div className="relative group">
              <label htmlFor="url" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Website Link
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <i className="fa-solid fa-link"></i>
                </div>
                <input
                  type="text"
                  id="url"
                  placeholder="e.g., example.com"
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={status !== ScanStatus.IDLE && status !== ScanStatus.ERROR}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!url || (status !== ScanStatus.IDLE && status !== ScanStatus.ERROR)}
              className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg transform active:scale-95 transition-all duration-200 flex items-center justify-center gap-3
                ${!url || (status !== ScanStatus.IDLE && status !== ScanStatus.ERROR) 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-1'
                }`}
            >
              {status === ScanStatus.IDLE && (
                <>
                  <i className="fa-solid fa-bolt"></i>
                  Start Full Audit
                </>
              )}
              {status === ScanStatus.FETCHING && (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Fetching Content...
                </>
              )}
              {status === ScanStatus.ANALYZING && (
                <>
                  <i className="fa-solid fa-brain fa-fade"></i>
                  AI Analysis in Progress...
                </>
              )}
              {status === ScanStatus.ERROR && (
                <>
                  <i className="fa-solid fa-rotate"></i>
                  Retry Analysis
                </>
              )}
            </button>
          </form>

          {status === ScanStatus.ANALYZING && (
             <div className="mt-8 space-y-4 animate-pulse">
                <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 w-2/3 animate-[shimmer_2s_infinite]"></div>
                </div>
                <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest">
                  Scanning DOM, Scripts, and CSS Assets
                </p>
             </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
              <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
          <div className="text-center">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-indigo-600">
              <i className="fa-solid fa-shield-virus"></i>
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Security Checks</h3>
            <p className="text-xs text-gray-500">Detect missing headers and vulnerabilities.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-green-600">
              <i className="fa-solid fa-universal-access"></i>
            </div>
            <h3 className="font-bold text-gray-900 text-sm">A11y Audit</h3>
            <p className="text-xs text-gray-500">Verify WCAG compliance standards.</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-orange-600">
              <i className="fa-solid fa-gauge-high"></i>
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Performance</h3>
            <p className="text-xs text-gray-500">Identify slow scripts and bottlenecks.</p>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-8 text-gray-400 text-sm font-medium">
        Powered by Google Gemini & Heuristic Scanning Engine
      </footer>
    </div>
  );
};

export default App;
