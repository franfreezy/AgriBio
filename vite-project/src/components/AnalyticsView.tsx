import React, { useState, useEffect } from 'react';
import { getAnalyzedFiles, getFileAnalysis, type AnalyzedFileData } from '../services/analyticsService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsView: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<AnalyzedFileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderLoadingSkeleton = () => {
    if (selectedFile) {
      // Loading skeleton for detailed view
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(index => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>

          {[1, 2].map(index => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      );
    }

    // Loading skeleton for list view
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(index => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1 max-w-[70%]">
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const fileList = await getAnalyzedFiles();
        setFiles(fileList);
        setError(null);
      } catch (err) {
        setError('Failed to load analyzed files');
        console.error('Error fetching files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleFileSelect = async (filename: string) => {
    try {
      setLoading(true);
      const analysisData = await getFileAnalysis(filename);
      setSelectedFile(analysisData);
      setError(null);
    } catch (err) {
      setError('Failed to load file analysis');
      console.error('Error fetching file analysis:', err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return renderLoadingSkeleton();
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <svg
          className="w-12 h-12 text-red-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      {selectedFile ? (
        // Detailed Analysis View
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-900">{selectedFile.filename}</h2>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to List
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Rows</h3>
              <p className="text-2xl font-semibold text-gray-900">{selectedFile.metadata.rows}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Columns</h3>
              <p className="text-2xl font-semibold text-gray-900">{selectedFile.metadata.columns}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Size</h3>
              <p className="text-2xl font-semibold text-gray-900">{(selectedFile.fileSize / 1024).toFixed(2)} KB</p>
            </div>
          </div>

          {selectedFile.analysis.visualizations.map((viz, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{viz.title}</h3>
              <div className="h-64">
                {viz.type === 'line' ? (
                  <Line data={viz.data} options={viz.options} />
                ) : (
                  <Bar data={viz.data} options={viz.options} />
                )}
              </div>
            </div>
          ))}

          {selectedFile.analysis.insights.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
              <ul className="space-y-2">
                {selectedFile.analysis.insights.map((insight, index) => (
                  <li key={index} className="text-gray-600">{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        // File List View
        <div className="h-full">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow p-8">
              <div className="bg-gray-50 rounded-full p-6 mb-6">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">No Analyzed Files Yet</h3>
              <p className="text-gray-500 text-center max-w-sm mb-6">
                Start by uploading data files in the Data Sources tab. Once processed, your analysis results will appear here.
              </p>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Go to Data Sources tab to upload files</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {files.map(filename => (
                <div
                  key={filename}
                  onClick={() => handleFileSelect(filename)}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{filename}</h3>
                      <p className="text-sm text-gray-500">Click to view analysis</p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
