import React, { useState, useEffect } from 'react';
import { Upload, List, AlertCircle, X, ExternalLink, Download } from 'lucide-react';
import { MessageList } from './components/MessageList';
import { DeletionModal } from './components/DeletionModal';
import { ProcessedMessage, StoredLink } from './types';
import { parseCSV, downloadAsJSONL } from './utils';

function App() {
  const [messages, setMessages] = useState<ProcessedMessage[]>([]);
  const [currentLinks, setCurrentLinks] = useState<{ messageId: string; link: string }[]>([]);
  const [storedLinks, setStoredLinks] = useState<StoredLink[]>([]);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('deletedLinks');
    if (stored) {
      setStoredLinks(JSON.parse(stored));
    }
  }, []);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file.');
      return;
    }

    try {
      const text = await file.text();
      const parsedMessages = parseCSV(text);
      setMessages(parsedMessages);
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error parsing CSV file';
      setError(`${errorMessage}. Please check the format.`);
      setMessages([]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleLinkProcess = (messageId: string, link: string) => {
    setCurrentLinks([{ messageId, link }]);
  };

  const handleReasonSubmit = (reason: string) => {
    const newStoredLink: StoredLink = {
      ...currentLinks[0],
      reason,
      deletionTime: new Date().toISOString(),
    };

    const updatedLinks = [...storedLinks, newStoredLink];
    setStoredLinks(updatedLinks);
    localStorage.setItem('deletedLinks', JSON.stringify(updatedLinks));
    setCurrentLinks([]);
  };

  const handleExportLinks = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadAsJSONL(storedLinks, `processed-links-${timestamp}.jsonl`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discord Link Analyzer</h1>
          <p className="text-lg text-gray-600">Process and categorize deleted links from Discord messages</p>
        </header>

        {/* File Upload */}
        <div className="mb-8">
          <label 
            htmlFor="csv-upload"
            className={`flex flex-col items-center justify-center w-full h-40 border-2 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
            } border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className={`w-12 h-12 mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV file with Discord messages</p>
            </div>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700 animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button 
              onClick={() => setError('')}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Messages List */}
        <MessageList 
          messages={messages}
          onLinkClick={handleLinkProcess}
          processedLinks={storedLinks}
        />

        {/* Deletion Modal */}
        {currentLinks.length > 0 && (
          <DeletionModal
            link={currentLinks[0].link}
            onClose={() => setCurrentLinks([])}
            onSubmit={handleReasonSubmit}
          />
        )}

        {/* Processed Links Summary */}
        {storedLinks.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <List className="w-5 h-5 text-blue-500" />
                Processed Links ({storedLinks.length})
              </h2>
              <button
                onClick={handleExportLinks}
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
                      <a 
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 break-all flex items-center gap-2"
                      >
                        {link.link}
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </a>
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
        )}
      </div>
    </div>
  );
}

export default App;