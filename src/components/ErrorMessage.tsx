import React, { memo } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorMessage = memo(({ error, onDismiss }: ErrorMessageProps) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700 animate-fadeIn">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{error}</span>
      <button 
        onClick={onDismiss}
        className="p-1 hover:bg-red-100 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage'; 