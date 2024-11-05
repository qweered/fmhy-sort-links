import { memo } from 'react';
import { List, Download, ExternalLink } from 'lucide-react';
import { StoredLink } from '../types';

interface ProcessedLinksSummaryProps {
  storedLinks: StoredLink[];
  onExport: () => void;
}

export const ProcessedLinksSummary = memo(({ storedLinks, onExport }: ProcessedLinksSummaryProps) => {
  if (storedLinks.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <List className="w-5 h-5 text-blue-500" />
          Processed Links ({storedLinks.length})
        </h2>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export JSONL
        </button>
      </div>
      <div className="space-y-3">
        {storedLinks.map((link, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 truncate">{link.link}</span>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Reason: <span className="font-medium">{link.reason}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(link.deletionTime).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ProcessedLinksSummary.displayName = 'ProcessedLinksSummary';