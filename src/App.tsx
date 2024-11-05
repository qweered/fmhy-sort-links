import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MessageList } from './components/MessageList';
import { DeletionModal } from './components/DeletionModal';
import { FileUpload } from './components/FileUpload';
import { ErrorMessage } from './components/ErrorMessage';
import { ProcessedLinksSummary } from './components/ProcessedLinksSummary';
import { ProcessedMessage, StoredLink } from './types';
import { parseCSV, downloadAsJSONL, extractLinks } from './utils';

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

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file.');
      return;
    }

    try {
      const text = await file.text();
      const parsedMessages = parseCSV(text);
      
      setMessages(prevMessages => {
        const existingIds = new Set(prevMessages.map(msg => msg.id));
        const newMessages = parsedMessages.filter(msg => !existingIds.has(msg.id));
        return [...prevMessages, ...newMessages];
      });
      
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error parsing CSV file';
      setError(`${errorMessage}. Please check the format.`);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    Array.from(e.dataTransfer.files).forEach(file => {
      processFile(file);
    });
  }, [processFile]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        processFile(file);
      });
    }
  }, [processFile]);

  const handleLinkProcess = useCallback((messageId: string, link: string) => {
    setCurrentLinks([{ messageId, link }]);
  }, []);

  const handleReasonSubmit = useCallback((reason: string) => {
    setStoredLinks(prevLinks => {
      const newStoredLink: StoredLink = {
        ...currentLinks[0],
        reason,
        deletionTime: new Date().toISOString(),
      };
      const updatedLinks = [...prevLinks, newStoredLink];
      localStorage.setItem('deletedLinks', JSON.stringify(updatedLinks));
      return updatedLinks;
    });
    setCurrentLinks([]);
  }, [currentLinks]);

  const handleExportLinks = useCallback(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const linksForExport = storedLinks.map(({ messageId, ...link }) => link);
    downloadAsJSONL(linksForExport, `processed-links-${timestamp}.jsonl`);
    setStoredLinks([]);
    localStorage.removeItem('deletedLinks');
  }, [storedLinks]);

  const unprocessedMessages = useMemo(() => 
    messages.filter(message => {
      const messageLinks = extractLinks(message.content);
      return messageLinks.some(link => 
        !storedLinks.some(stored => stored.link === link)
      );
    }),
    [messages, storedLinks]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discord Link Analyzer</h1>
          <p className="text-lg text-gray-600">Process and categorize deleted links from Discord messages</p>
        </header>

        <FileUpload
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileUpload={handleFileUpload}
        />

        <ErrorMessage 
          error={error}
          onDismiss={() => setError('')}
        />

        <MessageList 
          messages={unprocessedMessages}
          onLinkClick={handleLinkProcess}
          processedLinks={storedLinks}
        />

        {currentLinks.length > 0 && (
          <DeletionModal
            link={currentLinks[0].link}
            onClose={() => setCurrentLinks([])}
            onSubmit={handleReasonSubmit}
          />
        )}

        <ProcessedLinksSummary 
          storedLinks={storedLinks}
          onExport={handleExportLinks}
        />
      </div>
    </div>
  );
}

export default React.memo(App);