import React, { memo } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUpload = memo(({ 
  isDragging, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  onFileUpload 
}: FileUploadProps) => {
  return (
    <div className="mb-8">
      <label 
        htmlFor="csv-upload"
        className={`flex flex-col items-center justify-center w-full h-40 border-2 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
        } border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className={`w-12 h-12 mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">CSV files with Discord messages</p>
        </div>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          multiple
          className="hidden"
          onChange={onFileUpload}
        />
      </label>
    </div>
  );
});

FileUpload.displayName = 'FileUpload'; 