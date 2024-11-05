import { memo } from 'react';

interface MessageHeaderProps {
  author: string;
  date: string;
}

export const MessageHeader = memo(({ author, date }: MessageHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-medium leading-none">
          {author[0].toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-gray-900">{author}</h3>
        <span className="text-sm text-gray-500">
          {new Date(date).toLocaleString()}
        </span>
      </div>
    </div>
  );
});

MessageHeader.displayName = 'MessageHeader';