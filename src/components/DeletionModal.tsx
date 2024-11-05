import React, { memo, useState } from 'react';
import { X } from 'lucide-react';

interface DeletionModalProps {
  link: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const DELETION_REASONS = [
  'Spam',
  'Inappropriate Content',
  'Malicious Link',
  'Expired Link',
  'Broken Link',
  'Duplicate Content',
  'Copyright Violation',
  'Other'
];

export const DeletionModal = memo(({ link, onClose, onSubmit }: DeletionModalProps) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason === 'Other' ? customReason : reason);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Deletion Reason</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 break-all">{link}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                {DELETION_REASONS.map((r) => (
                  <label
                    key={r}
                    className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3">{r}</span>
                  </label>
                ))}
              </div>

              {reason === 'Other' && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter custom reason"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reason || (reason === 'Other' && !customReason)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

DeletionModal.displayName = 'DeletionModal';