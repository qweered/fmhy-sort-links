import { memo, useState, useEffect } from 'react';
import { ProcessedMessage } from '../../types';
import { extractLinks } from '../../utils';
import { MessageHeader } from './MessageHeader';
import { LinkItem } from './LinkItem';

interface MessageCardProps {
  message: ProcessedMessage;
  onLinkClick: (messageId: string, link: string) => void;
  isLinkProcessed: (link: string) => boolean;
  onFadeComplete: () => void;
  shouldFade: boolean;
}

export const MessageCard = memo(({ 
  message, 
  onLinkClick, 
  isLinkProcessed, 
  onFadeComplete, 
  shouldFade 
}: MessageCardProps) => {
  const links = extractLinks(message.content);
  const contentWithoutLinks = message.content
    .replace(/(?:<)?https?:\/\/[^\s<>]+(?:>)?/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^\s+|\s+$/gm, '');

  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (shouldFade && !isRemoving) {
      setIsRemoving(true);
      const timer = setTimeout(onFadeComplete, 5000);
      return () => clearTimeout(timer);
    }
  }, [shouldFade, onFadeComplete, isRemoving]);

  return (
    <div 
      className={`bg-white rounded-lg shadow p-4 hover:shadow-lg ${
        isRemoving ? 'animate-fadeOut' : ''
      }`}
    >
      {isRemoving && (
        <div className="mb-2 p-2 bg-green-50 text-green-700 rounded-lg text-sm animate-fadeIn">
          All links in this message have been processed
        </div>
      )}
      
      <MessageHeader author={message.author} date={message.date} />
      
      {contentWithoutLinks && (
        <p className="mt-2 text-gray-600 whitespace-pre-wrap">{contentWithoutLinks}</p>
      )}
      
      {links.length > 0 && (
        <div className="mt-3 space-y-2">
          {links.map((link, index) => (
            <LinkItem
              key={index}
              link={link}
              isProcessed={isLinkProcessed(link)}
              onProcess={() => onLinkClick(message.id, link)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

MessageCard.displayName = 'MessageCard';