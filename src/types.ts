export interface ProcessedMessage {
  id: string;
  authorId: string;
  author: string;
  date: string;
  content: string;
}

export interface StoredLink {
  messageId: string;
  link: string;
  reason: string;
  deletionTime: string;
}

export interface ParseError extends Error {
  line?: number;
  rawContent?: string;
}