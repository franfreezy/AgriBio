const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

export interface Report {
  id: number;
  name: string;
  type: string;
  created_at: string;
  file_size: number;
  download_url: string;
  status: 'completed' | 'processing' | 'failed';
  description?: string;
}

export const getReports = async (): Promise<Report[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const isSupabaseToken = token.split('.').length === 3;
    const authHeader = isSupabaseToken ? `Bearer ${token}` : `Token ${token}`;

    const response = await fetch(`${API_URL}/api/reports/list`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const downloadReport = async (reportId: number): Promise<void> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const isSupabaseToken = token.split('.').length === 3;
    const authHeader = isSupabaseToken ? `Bearer ${token}` : `Token ${token}`;

    const response = await fetch(`${API_URL}/api/reports/${reportId}/download/`, {
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download report');
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/["']/g, '')
      : `report-${reportId}.pdf`;

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading report:', error);
    throw error;
  }
};
