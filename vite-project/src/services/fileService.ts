const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface UploadedFile {
  id: number;
  filename: string;
  file_url: string;
  uploaded_at: string;
  status: 'waiting' | 'processing' | 'cleaned' | 'error';
  size: number;
}

// Get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Get auth header
const getAuthHeader = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }
  const isSupabaseToken = token.split('.').length === 3;
  return isSupabaseToken ? `Bearer ${token}` : `Token ${token}`;
};

export const getFiles = async (): Promise<UploadedFile[]> => {
  try {
    const response = await fetch(`${API_URL}/api/files/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

export const deleteFile = async (fileId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/files/${fileId}/`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete file');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
