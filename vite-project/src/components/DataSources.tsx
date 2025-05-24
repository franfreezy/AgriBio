import React from 'react';
import DataUpload from './DataUpload';

const DataSources: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Sources</h2>
          <p className="text-gray-600">
            Upload and manage your agricultural data files. We support various formats including CSV and Excel files.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border">
          <DataUpload />
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
