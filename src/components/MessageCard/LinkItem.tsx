import React, { memo } from 'react';
import { Link as LinkIcon, CheckCircle, ExternalLink } from 'lucide-react';

interface LinkItemProps {
  link: string;
  isProcessed: boolean;
  onProcess: () => void;
}

export const LinkItem = memo(({ link, isProcessed, onProcess }: LinkItemProps) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <LinkIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 truncate">{link}</span>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
      {isProcessed ? (
        <div className="flex items-center gap-1 text-green-500">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Processed</span>
        </div>
      ) : (
        <button
          onClick={onProcess}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Process
        </button>
      )}
    </div>
  );
});

LinkItem.displayName = 'LinkItem'; 