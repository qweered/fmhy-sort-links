import { ProcessedMessage, StoredLink } from '../types';
import { extractLinks } from '../utils';
import { Link as LinkIcon, CheckCircle, ExternalLink } from 'lucide-react';

interface MessageListProps {
  messages: ProcessedMessage[];
  onLinkClick: (messageId: string, link: string) => void;
  processedLinks: StoredLink[];
}

export function MessageList({ messages, onLinkClick, processedLinks }: MessageListProps) {
  if (messages.length === 0) return null;

  const isLinkProcessed = (link: string) => {
    return processedLinks.some(processed => processed.link === link);
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const links = extractLinks(message.content);
        const contentWithoutLinks = message.content.replace(/(?:<)?https?:\/\/[^\s<>]+(?:>)?/g, '');
        
        return (
          <div key={message.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium">
                  {message.author[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{message.author}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(message.date).toLocaleString()}
                  </span>
                </div>
                
                {/* Message content without links */}
                {contentWithoutLinks.trim() && (
                  <p className="mt-2 text-gray-600 whitespace-pre-wrap">{contentWithoutLinks}</p>
                )}
                
                {/* Links section */}
                {links.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {links.map((link, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 truncate">{link}</span>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                        {isLinkProcessed(link) ? (
                          <div className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Processed</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onLinkClick(message.id, link)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            Process
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}