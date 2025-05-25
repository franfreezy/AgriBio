import React, { useState, useRef } from 'react';
import { uploadFile } from '../services/etlService';

interface UploadedFile {
  name: string;
  status: 'uploaded' | 'error';
  timestamp: Date;
  type: string;
  size: number;
  message?: string;
  url?: string;
}

interface DataUploadProps {
  onFileUploaded?: () => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onFileUploaded }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processingStatus, setProcessingStatus] = useState({
    processed: 0,
    waiting: 0,
    total: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    switch (extension) {
      case 'csv':
        return 'CSV';
      case 'xlsx':
      case 'xls':
        return 'Excel';
      default:
        return 'Other';
    }
  };

  const processFile = async (file: File) => {
    try {
      return await uploadFile(file);
    } catch (error) {
      console.error('Error processing file:', error);
      return {
        status: 'error',
        message: 'Failed to process file'
      };
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {      const newFiles: UploadedFile[] = Array.from(files).map(file => ({
        name: file.name,
        status: 'uploading',
        timestamp: new Date(),
        type: getFileType(file.name),
        size: file.size
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await processFile(file);

        setUploadedFiles(prev =>
          prev.map(f => {
            if (f.name === file.name) {
              return {
                ...f,
                status: result.status,
                message: result.message,
                url: result.url
              };
            }
            return f;
          })
        );
      }

      // Call onFileUploaded after all files are processed
      if (onFileUploaded) {
        onFileUploaded();
      }

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📄';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#2c5530] mb-2">Data Sources</h2>
        <p className="text-gray-600 mb-4">Upload your agricultural data files for processing</p>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          multiple
          accept=".csv,.xlsx,.xls"
        />
        
        <button
          onClick={handleUploadClick}
          className="bg-[#2c5530] hover:bg-[#234225] text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Upload Files
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Uploaded Files</h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getStatusIcon(file.status)}</span>
                  <div>
                    <span className="font-medium block">{file.name}</span>
                    <span className="text-sm text-gray-500">
                      {file.type} • {(file.size / 1024).toFixed(1)} KB • 
                      {file.timestamp.toLocaleTimeString()}
                    </span>
                    {file.stats && (
                      <div className="text-xs text-gray-500 mt-1">
                        Rows: {file.stats.row_count.toLocaleString()} • 
                        Columns: {file.stats.column_count} • 
                        Duplicates Removed: {file.stats.duplicates_removed}
                      </div>
                    )}
                    {file.message && (
                      <p className={`text-xs mt-1 ${file.status === 'error' ? 'text-red-600' : 'text-gray-500'}`}>
                        {file.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(file.status)}`}
                  >
                    {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Processing Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Processing Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2c5530]">{processingStatus.total}</div>
                <div className="text-sm text-gray-500">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{processingStatus.processed}</div>
                <div className="text-sm text-gray-500">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{processingStatus.waiting}</div>
                <div className="text-sm text-gray-500">Waiting</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUpload;
