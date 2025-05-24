import React, { useState } from 'react';
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
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
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

interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dateProcessed: Date;
  stats: {
    rowCount: number;
    columnCount: number;
    missingValues: number;
    dataTypes: { [key: string]: number };
  };
  visualizations: {
    monthlyTrends: { month: string; value: number }[];
    categoryDistribution: { category: string; count: number }[];
    correlationMetrics: { metric: string; value: number }[];
  };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

interface AnalyticsViewProps {
  processedFiles: ProcessedFile[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ processedFiles }) => {
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null);

  const renderFileList = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Processed Files</h2>
      <div className="space-y-3">
        {processedFiles.map(file => (
          <div
            key={file.id}
            onClick={() => setSelectedFile(file)}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              selectedFile?.id === file.id
                ? 'bg-[#2c5530] text-white'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${selectedFile?.id === file.id ? 'text-white' : 'text-gray-800'}`}>
                  {file.name}
                </h3>
                <p className={`text-sm ${selectedFile?.id === file.id ? 'text-gray-100' : 'text-gray-500'}`}>
                  {file.type} • {(file.size / 1024).toFixed(1)} KB • 
                  {file.dateProcessed.toLocaleDateString()}
                </p>
              </div>
              <div className={`text-sm ${selectedFile?.id === file.id ? 'text-gray-100' : 'text-gray-500'}`}>
                {file.stats.rowCount.toLocaleString()} rows
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFileAnalytics = () => {
    if (!selectedFile) return null;

    const monthlyData: ChartData = {
      labels: selectedFile.visualizations.monthlyTrends.map(item => item.month),
      datasets: [{
        label: 'Monthly Trends',
        data: selectedFile.visualizations.monthlyTrends.map(item => item.value),
        borderColor: '#2c5530',
        backgroundColor: 'rgba(44, 85, 48, 0.1)',
        borderWidth: 2
      }]
    };

    const categoryData: ChartData = {
      labels: selectedFile.visualizations.categoryDistribution.map(item => item.category),
      datasets: [{
        label: 'Category Distribution',
        data: selectedFile.visualizations.categoryDistribution.map(item => item.count),
        backgroundColor: [
          '#2c5530',
          '#4A90E2',
          '#F39C12',
          '#8E44AD',
          '#C0392B'
        ]
      }]
    };

    const metricsData: ChartData = {
      labels: selectedFile.visualizations.correlationMetrics.map(item => item.metric),
      datasets: [{
        label: 'Correlation Metrics',
        data: selectedFile.visualizations.correlationMetrics.map(item => item.value),
        backgroundColor: '#2c5530',
        borderWidth: 0
      }]
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{selectedFile.name}</h2>
              <p className="text-gray-500">
                Processed on {selectedFile.dateProcessed.toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* File Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Rows</p>
              <p className="text-xl font-semibold text-gray-800">
                {selectedFile.stats.rowCount.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Columns</p>
              <p className="text-xl font-semibold text-gray-800">
                {selectedFile.stats.columnCount.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Missing Values</p>
              <p className="text-xl font-semibold text-gray-800">
                {selectedFile.stats.missingValues.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">File Size</p>
              <p className="text-xl font-semibold text-gray-800">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
            <div className="h-64">
              <Line
                data={monthlyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
            <div className="h-64">
              <Pie
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Correlation Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Correlation Metrics</h3>
          <div className="h-64">
            <Bar
              data={metricsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8">
      {renderFileList()}
      {renderFileAnalytics()}
    </div>
  );
};

export default AnalyticsView;
