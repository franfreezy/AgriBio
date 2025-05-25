import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataSources from './DataSources';
import AnalyticsView from './AnalyticsView';
import ODKInterface from './ODKInterface';
import Loading from './Loading';
import { getDashboardStats, getFormsCount } from '../services/dashboardService';
import type { DashboardStats } from '../services/dashboardService';
import { getReports, downloadReport } from '../services/reportService';
import type { Report } from '../services/reportService';
import { mockProjects } from './ODKInterface';

interface DashboardProps {
  onLogout: () => void;
}

type TabType = 'overview' | 'analytics' | 'reports' | 'data' | 'odk';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview' as const, name: 'Overview', icon: '📊' },
    { id: 'analytics' as const, name: 'Analytics', icon: '📈' },
    { id: 'reports' as const, name: 'Reports', icon: '📋' },
    { id: 'data' as const, name: 'Data Sources', icon: '🗄️' },
    { id: 'odk' as const, name: 'ODK Forms', icon: '📱' }
  ];
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const stats = await getDashboardStats();
        if (stats) {
          // Calculate total forms from mockProjects
          const totalForms = mockProjects.reduce((total, project) => total + project.forms.length, 0);
          const forms_trend = 0; // This would normally come from comparing with historical data
          
          setDashboardStats(prev => ({
            ...prev,
            ...stats,
            total_forms: totalForms,
            forms_trend
          }));
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      }
    };

    // Initial load with loading state
    setLoading(true);
    fetchDashboardStats().finally(() => setLoading(false));

    // Subsequent updates without loading state
    const interval = setInterval(fetchDashboardStats, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (reportId: number) => {
    try {
      await downloadReport(reportId);
    } catch (err) {
      console.error('Failed to download report:', err);
      setError('Failed to download report');
    }
  };

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports');
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

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
    }  ], []);

  // Fetch reports when the Reports tab is activated
  useEffect(() => {
    if (activeTab === 'reports') {
      setError(null);
      setReportsLoading(true);
      fetchReports().finally(() => setReportsLoading(false));
    }
  }, [activeTab]);

  // Auto-slide processed files
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFileIndex((prev) => 
        prev === processedFiles.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [processedFiles.length]);


  const handleLogout = async () => {
    await onLogout();
    navigate('/', { replace: true });
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
              <h1 className="ml-3 text-xl font-bold text-[#2c5530]">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
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
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
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
                    <p className="text-sm font-medium text-gray-600">Processed Files</p>                    {loading ? (
                      <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
                    ) : error ? (
                      <p className="text-sm text-red-500">Error loading data</p>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.active_users || 0}
                        </p>
                        <p className="text-sm text-green-600">
                          {dashboardStats && dashboardStats.users_trend > 0 
                            ? `+${dashboardStats.users_trend}% from last week`
                            : 'No change from last week'}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-[#2c5530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>                    <p className="text-sm font-medium text-gray-600">Total Forms</p>
                    {loading ? (
                      <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
                    ) : error ? (
                      <p className="text-sm text-red-500">Error loading data</p>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.total_forms || 0}
                        </p>
                        <p className="text-sm text-green-600">
                          {dashboardStats && dashboardStats.forms_trend > 0 
                            ? `+${dashboardStats.forms_trend}% from last week`
                            : 'No change from last week'}
                        </p>
                      </>
                    )}
                  </div>                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Uploads</p>
                    {loading ? (
                      <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
                    ) : error ? (
                      <p className="text-sm text-red-500">Error loading data</p>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.total_uploads || 0}
                        </p>
                        <p className="text-sm text-green-600">
                          {dashboardStats && dashboardStats.uploads_trend > 0 
                            ? `+${dashboardStats.uploads_trend}% from last week`
                            : 'No change from last week'}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                </div>
              </div>              <div className="bg-white rounded-lg shadow p-6">                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                    {loading ? (
                      <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
                    ) : error ? (
                      <p className="text-sm text-red-500">Error loading data</p>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.reports_generated || 0}
                        </p>
                        <p className="text-sm text-green-600">
                          {dashboardStats && dashboardStats.reports_trend > 0 
                            ? `+${dashboardStats.reports_trend}% from last week`
                            : 'No change from last week'}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>            {/* Latest Insights */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Latest Insights</h3>
              <div className="relative overflow-hidden h-64">
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
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500">{file.type}</span>
                        <h4 className="text-xl font-medium text-[#2c5530]">{file.name}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h5 className="font-medium text-gray-700">File Statistics</h5>
                          <ul className="list-disc list-inside space-y-2">
                            <li className="text-gray-600">
                              {file.stats.rowCount.toLocaleString()} rows analyzed
                            </li>
                            <li className="text-gray-600">
                              {file.stats.columnCount} columns processed
                            </li>
                            <li className="text-gray-600">
                              Data quality: {((1 - file.stats.missingValues / (file.stats.rowCount * file.stats.columnCount)) * 100).toFixed(1)}%
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h5 className="font-medium text-gray-700">Key Metrics</h5>
                          <ul className="list-disc list-inside space-y-2">
                            {file.visualizations.correlationMetrics.map(metric => (
                              <li key={metric.metric} className="text-gray-600">
                                {metric.metric}: {(metric.value * 100).toFixed(0)}% correlation
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 right-0 flex space-x-2">
                  {processedFiles.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentFileIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentFileIndex ? 'bg-[#2c5530]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <AnalyticsView processedFiles={[]} />
          </div>
        )}        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#2c5530] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {reportsLoading ? (
              <div className="flex justify-center py-8">
                <Loading />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setReportsLoading(true);
                    fetchReports().finally(() => setReportsLoading(false));
                  }}
                  className="mt-4 text-[#2c5530] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12">
                {searchTerm ? (
                  <>
                    <p className="text-gray-500">No reports match your search.</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 text-[#2c5530] hover:underline"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500">No reports available yet.</p>
                    <p className="text-sm text-gray-400">Reports will appear here after processing data.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#2c5530] bg-opacity-10 rounded-lg">
                        <svg
                          className="w-6 h-6 text-[#2c5530]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(report.created_at).toLocaleDateString()} •{' '}
                          {(report.file_size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          report.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                      {report.status === 'completed' && (
                        <button
                          onClick={() => handleDownload(report.id)}
                          className="text-[#2c5530] hover:text-[#234225] transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'data' && (
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
