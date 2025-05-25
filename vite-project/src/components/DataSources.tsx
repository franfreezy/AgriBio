import React, { useEffect, useState } from 'react';
import DataUpload from './DataUpload';
import { getFiles, deleteFile } from '../services/fileService';
import type { UploadedFile } from '../services/fileService';

const DataSources: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await getFiles();
      setFiles(data);
      setError(null);
    } catch (err) {
      setError('Failed to load files');
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      setDeleting(fileId);
      await deleteFile(fileId);
      await loadFiles(); // Refresh the list
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete file. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Sources</h2>
          <p className="text-gray-600">
            Upload and manage your agricultural data files. We support various formats including CSV and Excel files.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <DataUpload onFileUploaded={loadFiles} />
        </div>

        {/* Files List */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files</h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c5530] mx-auto"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : files.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No files uploaded yet</div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{file.filename}</h4>
                        <p className="text-sm text-gray-500">
                          Uploaded on {new Date(file.uploaded_at).toLocaleDateString()} • 
                          {(file.size / 1024).toFixed(1)} KB • 
                          Status: <span className={`font-medium ${
                            file.status === 'cleaned' ? 'text-green-600' :
                            file.status === 'error' ? 'text-red-600' :
                            file.status === 'processing' ? 'text-blue-600' :
                            'text-gray-600'
                          }`}>{file.status}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={file.file_url}
                          download
                          className="px-3 py-1 bg-[#2c5530] text-white rounded hover:bg-[#1e3c20] transition-colors"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => handleDelete(file.id)}
                          disabled={deleting === file.id}
                          className={`px-3 py-1 rounded transition-colors ${
                            deleting === file.id
                              ? 'bg-red-300 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          {deleting === file.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Supported File Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-[#2c5530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">CSV Files</h4>
                <p className="text-gray-600 text-sm">Standard comma-separated values format</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-[#2c5530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Excel Files</h4>
                <p className="text-gray-600 text-sm">Both .xlsx and .xls formats supported</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSources;
