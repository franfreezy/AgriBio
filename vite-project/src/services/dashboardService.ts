const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Activity {
  id: string;
  type: 'upload' | 'process' | 'report';
  fileName: string;
  timestamp: string;
  status: string;
}

export interface DashboardStats {
  total_uploads: number;
  uploads_trend: number;
  last_week_uploads: number;
  active_users: number;
  total_clicks: number;
  users_trend: number;
  clicks_trend: number;
  total_forms: number;
  forms_trend: number;
}

export interface ReportFile {
  name: string;
  path: string;
  created: string;
}

// Get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Get the total number of forms from all projects
export const getFormsCount = (mockProjects: any[]): number => {
  return mockProjects.reduce((total, project) => total + (project.forms?.length || 0), 0);
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Check if this is a Supabase token (they are typically JWTs) or Django token
    const isSupabaseToken = token.split('.').length === 3;
    const authHeader = isSupabaseToken ? `Bearer ${token}` : `Token ${token}`;

    const response = await fetch(`${API_URL}/api/stats/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getRecentActivities = async (): Promise<Activity[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const isSupabaseToken = token.split('.').length === 3;
    const authHeader = isSupabaseToken ? `Bearer ${token}` : `Token ${token}`;

    const response = await fetch(`${API_URL}/api/activities/recent`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent activities');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

export const getReportsList = async (): Promise<ReportFile[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const isSupabaseToken = token.split('.').length === 3;
    const authHeader = isSupabaseToken ? `Bearer ${token}` : `Token ${token}`;

    const response = await fetch(`${API_URL}/api/reports/list`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reports list');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};
