import { ProcessedMessage } from './types';

export function parseCSV(csvText: string): ProcessedMessage[] {
  // First, normalize line endings
  const normalizedText = csvText.replace(/\r\n/g, '\n');

  // Split into lines while preserving quoted content
  const lines: string[] = [];
  let currentLine = '';
  let insideQuotes = false;

  for (let i = 0; i < normalizedText.length; i++) {
    const char = normalizedText[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    }

    if (char === '\n' && !insideQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  return lines.map((line, index) => {
    try {
      // Split the line into parts while respecting quotes
      const parts: string[] = [];
      let part = '';
      insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          insideQuotes = !insideQuotes;
          continue;
        }

        if (char === ',' && !insideQuotes) {
          parts.push(part);
          part = '';
        } else {
          part += char;
        }
      }

      parts.push(part);

      // Ensure we have at least 4 parts (id, author, date, content)
      if (parts.length < 4) {
        throw new Error(
          `Invalid CSV format at line ${index + 1}: missing columns`
        );
      }

      const [authorId, author, date, ...contentParts] = parts;
      const content = contentParts.join(',').trim();


      return {
        id: `msg-${index}`,
        authorId: authorId,
        author: author.trim(),
        date: date.trim(),
        content: content
          .replace(/^"(.*)"$/s, '$1') // Remove surrounding quotes, with 's' flag for multiline
          .replace(/""/g, '"') // Handle escaped quotes
          .trim(),
      };
    } catch (error) {
      console.error(`Error parsing line ${index + 1}:`, line);
      throw error;
    }
  });
}

export function extractLinks(text: string): string[] {
  // Match URLs with or without angle brackets
  const urlRegex = /(?:<)?(https?:\/\/[^\s<>"\n]+)(?:>)?/g;
  const matches = text.match(urlRegex) || [];

  // Clean up the matches
  return matches
    .map(
      (url) =>
        url
          .replace(/^<|>$/g, '') // Remove angle brackets
          .replace(/["']+$/, '') // Remove trailing quotes
          .replace(/[,.\s]+$/, '') // Remove trailing punctuation and whitespace
    )
    .filter(Boolean); // Remove any empty strings
}

export function downloadAsJSONL(data: any[], filename: string) {
  // Convert each object to a JSON string and join with newlines
  const jsonl = data.map((item) => JSON.stringify(item)).join('\n');

  // Create blob and download
  const blob = new Blob([jsonl], { type: 'application/x-jsonlines' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
