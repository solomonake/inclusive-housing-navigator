'use client';

import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  acceptedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'],
  maxSize = 10,
  className
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      return `Unsupported file type. Please upload ${acceptedTypes.includes('application/pdf') ? 'PDF, ' : ''}${acceptedTypes.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ? 'DOCX, ' : ''}${acceptedTypes.includes('text/plain') ? 'TXT' : ''} files only.`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File too large. Please upload files smaller than ${maxSize}MB.`;
    }
    
    return null;
  }, [acceptedTypes, maxSize]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setError(null);
      onFileSelect(file);
    }
  }, [onFileSelect, validateFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setError(null);
      onFileSelect(file);
    }
  }, [onFileSelect, validateFile]);

  const handleRemoveFile = useCallback(() => {
    setError(null);
    onFileRemove();
  }, [onFileRemove]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type === 'text/plain') return '📃';
    return '📎';
  };

  return (
    <div className={cn('w-full', className)}>
      {!selectedFile ? (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer',
            isDragOver 
              ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10'
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upload Your Lease Document
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your file here, or click to browse
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">PDF</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">DOCX</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">TXT</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">Max {maxSize}MB</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{getFileIcon(selectedFile.type)}</span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRemoveFile}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
