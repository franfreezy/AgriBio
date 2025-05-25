const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AnalyzedFileData {
  id: string;
  filename: string;
  analysisDate: string;
  fileSize: number;
  metadata: {
    rows: number;
    columns: number;
    dataTypes: { [key: string]: string };
  };
  analysis: {
    summary: any;
    visualizations: any[];
    insights: string[];
  };
}

// Get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

export const getAnalyzedFiles = async (): Promise<string[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_URL}/api/analysis/files/`, {
    headers: {
      'Authorization': `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analyzed files');
  }

  return await response.json();
};

export const getFileAnalysis = async (filename: string): Promise<AnalyzedFileData> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_URL}/api/analysis/files/${filename}`, {
    headers: {
      'Authorization': `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch file analysis');
  }

  return await response.json();
};
