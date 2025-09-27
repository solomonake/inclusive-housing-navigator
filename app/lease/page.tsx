'use client';

import React, { useState } from 'react';
import { AriaLive } from '@/components/accessibility/aria-live';

interface LeaseAnalysis {
  summary: string;
  red_flags: string[];
  key_terms: string[];
  recommendations: string[];
  compliance_notes: string[];
  translation: string;
}

export default function LeasePage() {
  const [leaseText, setLeaseText] = useState('');
  const [language, setLanguage] = useState('en');
  const [analysis, setAnalysis] = useState<LeaseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const handleAnalyze = async () => {
    if (!leaseText.trim()) {
      setError('Please enter lease text to analyze');
      setAnnouncement('Error: Please enter lease text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setAnnouncement('Analyzing lease document...');

    try {
      const response = await fetch('/api/lease-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaseText, language })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.data.analysis);
        setAnnouncement('Lease analysis completed successfully');
      } else {
        setError(data.error || 'Analysis failed');
        setAnnouncement(`Error: ${data.error || 'Analysis failed'}`);
      }
    } catch (error) {
      setError('Failed to analyze lease. Please try again.');
      setAnnouncement('Error: Failed to analyze lease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!analysis) return;
    
    const content = `# Lease Analysis Report

## Summary
${analysis.summary}

## Key Terms
${analysis.key_terms.map(term => `- ${term}`).join('\n')}

## Red Flags
${analysis.red_flags.map(flag => `- ${flag}`).join('\n')}

## Recommendations
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

## Compliance Notes
${analysis.compliance_notes.map(note => `- ${note}`).join('\n')}

## Translation
${analysis.translation}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lease-analysis.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      <AriaLive message={announcement} assertive={!!error} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[hsl(var(--fg))] mb-2">
            Lease QA Analysis
          </h1>
          <p className="text-[hsl(var(--fg-muted))] mb-8">
            Upload your lease document for AI-powered analysis, translation, and compliance checking
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-semibold mb-4">Lease Document</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium mb-2">
                      Document Language
                    </label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md focus-ring bg-[hsl(var(--bg))] text-[hsl(var(--fg))]"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="leaseText" className="block text-sm font-medium mb-2">
                      Lease Text
                    </label>
                    <textarea
                      id="leaseText"
                      value={leaseText}
                      onChange={(e) => setLeaseText(e.target.value)}
                      placeholder="Paste your lease document text here..."
                      className="w-full h-64 px-3 py-2 border border-[hsl(var(--border))] rounded-md focus-ring bg-[hsl(var(--bg))] text-[hsl(var(--fg))] resize-vertical"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !leaseText.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Lease'}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {analysis ? (
                <>
                  {/* Summary */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Summary</h3>
                    <p className="text-sm text-[hsl(var(--fg-muted))]">{analysis.summary}</p>
                  </div>

                  {/* Key Terms */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Key Terms</h3>
                    <ul className="space-y-2">
                      {analysis.key_terms.map((term, index) => (
                        <li key={index} className="text-sm text-[hsl(var(--fg-muted))]">
                          • {term}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Flags */}
                  {analysis.red_flags.length > 0 && (
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Red Flags</h3>
                      <ul className="space-y-2">
                        {analysis.red_flags.map((flag, index) => (
                          <li key={index} className="text-sm text-red-600">
                            • {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-[hsl(var(--fg-muted))]">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compliance Notes */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Compliance Notes</h3>
                    <ul className="space-y-2">
                      {analysis.compliance_notes.map((note, index) => (
                        <li key={index} className="text-sm text-[hsl(var(--fg-muted))]">
                          • {note}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Translation */}
                  {analysis.translation && (
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold mb-4">Translation</h3>
                      <p className="text-sm text-[hsl(var(--fg-muted))]">{analysis.translation}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDownload}
                      className="btn-secondary flex-1"
                    >
                      📄 Download Report
                    </button>
                    <button
                      onClick={() => {
                        setAnalysis(null);
                        setLeaseText('');
                        setError('');
                      }}
                      className="btn-secondary"
                    >
                      🔄 New Analysis
                    </button>
                  </div>
                </>
              ) : (
                <div className="card p-6 text-center">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-[hsl(var(--fg-muted))]">
                    Upload your lease document and click "Analyze Lease" to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
