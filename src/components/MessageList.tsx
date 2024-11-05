import { useState, useEffect, useCallback, memo } from 'react';
import { ProcessedMessage, StoredLink } from '../types';
import { extractLinks } from '../utils';
import { MessageCard } from './MessageCard/MessageCard';

interface MessageListProps {
  messages: ProcessedMessage[];
  onLinkClick: (messageId: string, link: string) => void;
  processedLinks: StoredLink[];
}

export const MessageList = memo(({ messages, onLinkClick, processedLinks }: MessageListProps) => {
  const [visibleMessages, setVisibleMessages] = useState<ProcessedMessage[]>(messages);
  const [fadingMessages, setFadingMessages] = useState<Set<string>>(new Set());

  // Update visible messages when input messages change
  useEffect(() => {
    setVisibleMessages(messages);
  }, [messages]);

  // Check if a link has been processed
  const isLinkProcessed = useCallback((link: string) => {
    return processedLinks.some(processed => processed.link === link);
  }, [processedLinks]);

  // Check if all links in a message have been processed
  const areAllLinksProcessed = useCallback((message: ProcessedMessage) => {
    const links = extractLinks(message.content);
    return links.length > 0 && links.every(isLinkProcessed);
  }, [isLinkProcessed]);

  // Handle message removal after fade animation
  const handleFadeComplete = useCallback((messageId: string) => {
    setVisibleMessages(prev => prev.filter(m => m.id !== messageId));
    setFadingMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);

  // Check for newly processed messages and start their fade animations
  useEffect(() => {
    const messagesToFade = visibleMessages.filter(message => 
      areAllLinksProcessed(message) && !fadingMessages.has(message.id)
    );

    if (messagesToFade.length > 0) {
      setFadingMessages(prev => {
        const newSet = new Set(prev);
        messagesToFade.forEach(message => newSet.add(message.id));
        return newSet;
      });
    }
  }, [processedLinks, visibleMessages, areAllLinksProcessed, fadingMessages]);

  if (visibleMessages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No messages to process
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visibleMessages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onLinkClick={onLinkClick}
          isLinkProcessed={isLinkProcessed}
          onFadeComplete={() => handleFadeComplete(message.id)}
          shouldFade={fadingMessages.has(message.id)}
        />
      ))}
    </div>
  );
});

MessageList.displayName = 'MessageList';