import React, { useState, useEffect, useMemo } from 'react';
import DataSources from './DataSources';
import AnalyticsView from './AnalyticsView';
import ODKInterface from './ODKInterface';

interface DashboardProps {
  onLogout: () => void;
}

interface RecentActivity {
  id: string;
  type: 'upload' | 'process' | 'report';
  fileName: string;
  timestamp: Date;
  status: string;
}

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
    dataTypes: {
      numeric: number;
      categorical: number;
      temporal: number;
    };
  };
  visualizations: {
    monthlyTrends: Array<{ month: string; value: number }>;
    categoryDistribution: Array<{ category: string; count: number }>;
    correlationMetrics: Array<{ metric: string; value: number }>;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // Mock data - In a real app, this would come from your backend
  const recentActivities: RecentActivity[] = [
    { id: '1', type: 'upload', fileName: 'farm_data_2025.csv', timestamp: new Date(), status: 'success' },
    { id: '2', type: 'process', fileName: 'yield_analysis.xlsx', timestamp: new Date(Date.now() - 3600000), status: 'completed' },
    { id: '3', type: 'report', fileName: 'Q2_Report.pdf', timestamp: new Date(Date.now() - 7200000), status: 'generated' },
    { id: '4', type: 'upload', fileName: 'soil_samples.csv', timestamp: new Date(Date.now() - 10800000), status: 'success' },
    { id: '5', type: 'process', fileName: 'crop_data.xlsx', timestamp: new Date(Date.now() - 14400000), status: 'completed' },
  ];

  // Mock processed files data
  const processedFiles = useMemo(() => [
    {
      id: '1',
      name: 'crop_yield_2025.csv',
      type: 'CSV',
      size: 1024 * 50, // 50KB
      dateProcessed: new Date('2025-05-20'),
      stats: {
        rowCount: 1500,
        columnCount: 8,
        missingValues: 24,
        dataTypes: {
          numeric: 5,
          categorical: 2,
          temporal: 1
        }
      },
      visualizations: {
        monthlyTrends: [
          { month: 'Jan', value: 120 },
          { month: 'Feb', value: 150 },
          { month: 'Mar', value: 180 },
          { month: 'Apr', value: 170 },
          { month: 'May', value: 190 }
        ],
        categoryDistribution: [
          { category: 'Maize', count: 450 },
          { category: 'Wheat', count: 380 },
          { category: 'Rice', count: 320 },
          { category: 'Beans', count: 350 }
        ],
        correlationMetrics: [
          { metric: 'Rainfall', value: 0.85 },
          { metric: 'Temperature', value: 0.65 },
          { metric: 'Soil pH', value: 0.72 },
          { metric: 'Fertilizer', value: 0.78 }
        ]
      }
    },
    {
      id: '2',
      name: 'soil_analysis_q2.xlsx',
      type: 'Excel',
      size: 1024 * 75, // 75KB
      dateProcessed: new Date('2025-05-22'),
      stats: {
        rowCount: 2200,
        columnCount: 12,
        missingValues: 45,
        dataTypes: {
          numeric: 8,
          categorical: 3,
          temporal: 1
        }
      },
      visualizations: {
        monthlyTrends: [
          { month: 'Jan', value: 85 },
          { month: 'Feb', value: 92 },
          { month: 'Mar', value: 88 },
          { month: 'Apr', value: 95 },
          { month: 'May', value: 98 }
        ],
        categoryDistribution: [
          { category: 'Clay', count: 850 },
          { category: 'Loam', count: 720 },
          { category: 'Sandy', count: 630 }
        ],
        correlationMetrics: [
          { metric: 'Nitrogen', value: 0.92 },
          { metric: 'Phosphorus', value: 0.78 },
          { metric: 'Potassium', value: 0.85 },
          { metric: 'pH Level', value: 0.68 }
        ]
      }
    }
  ], []);

  // Auto-slide processed files
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFileIndex((prev) => 
        prev === processedFiles.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [processedFiles.length]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return '📤';
      case 'process':
        return '⚙️';
      case 'report':
        return '📄';
      default:
        return '📁';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/imglogo.jpeg" 
                alt="AB DATA Logo" 
                className="h-8 w-8 object-contain"
              />
              <h1 className="ml-3 text-xl font-bold text-[#2c5530]">AB DATA Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z"/>
                </svg>
              </button>              <button 
                onClick={onLogout}
                className="bg-[#2c5530] text-white px-4 py-2 rounded-md hover:bg-[#234225] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'reports', name: 'Reports', icon: '📋' },
              { id: 'data', name: 'Data Sources', icon: '🗄️' },
              { id: 'odk', name: 'ODK Forms', icon: '📱' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#2c5530] text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processed Files</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                    <p className="text-sm text-green-600">+8% from last week</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-[#2c5530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Uploads</p>
                    <p className="text-2xl font-bold text-gray-900">32</p>
                    <p className="text-sm text-green-600">+12% from last week</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">18</p>
                    <p className="text-sm text-green-600">+5% from last week</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-sm text-green-600">+23% from last week</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>            {/* Insights and Recent Activities */}
            <div className="space-y-6">
              {/* File Insights */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Insights</h3>
                <div className="relative overflow-hidden h-32">
                  <div 
                    className="transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentFileIndex * 100}%)` }}
                  >
                    {processedFiles.map((file, index) => (
                      <div 
                        key={file.id}
                        className={`absolute w-full ${index === currentFileIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ left: `${index * 100}%` }}
                      >
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-500">{file.type}</span>
                          <h4 className="font-medium text-[#2c5530]">{file.name}</h4>
                        </div>                        <ul className="list-disc list-inside space-y-1">
                          <li className="text-gray-600 text-sm">
                            {file.stats.rowCount.toLocaleString()} rows analyzed
                          </li>
                          <li className="text-gray-600 text-sm">
                            {file.stats.columnCount} columns processed
                          </li>
                          <li className="text-gray-600 text-sm">
                            Data quality: {((1 - file.stats.missingValues / (file.stats.rowCount * file.stats.columnCount)) * 100).toFixed(1)}%
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        <span className="text-xl">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.fileName}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">
                            {activity.timestamp.toLocaleDateString()} {activity.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            processedFiles={processedFiles}
          />
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports</h3>
            <div className="space-y-4">
              {[
                'Monthly Agricultural Performance Report',
                'Environmental Impact Analysis',
                'Crop Yield Optimization Report',
                'Sustainability Metrics Dashboard'
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <span className="font-medium">{report}</span>
                  <button className="bg-[#2c5530] text-white px-4 py-2 rounded-md hover:bg-[#234225] transition-colors">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Sources Tab */}        {activeTab === 'data' && (
          <div className="bg-white rounded-lg shadow">
            <DataSources />
          </div>
        )}

        {activeTab === 'odk' && (
          <div className="bg-white rounded-lg shadow p-6">
            <ODKInterface />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
