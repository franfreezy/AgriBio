const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Get the auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

export interface ETLResponse {
  status: 'uploaded' | 'error';
  message: string;
  id?: number;
  name?: string;
  url?: string;
  size?: number;
  file_type?: string;
}

export const uploadFile = async (file: File): Promise<ETLResponse> => {
  try {
    const formData = new FormData();      formData.append('file', file);
    const token = getAuthToken();
    
    // Debug logging
    console.log('=== Upload Request Debug Info (Frontend) ===');
    console.log('Token from localStorage:', token);
    console.log('API URL:', `${API_URL}/api/upload/`);
    console.log('File being uploaded:', file.name, file.type, file.size);
    console.log('======================================');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/api/upload/`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Token ${token}`,
      },      credentials: 'include',
    });
    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const errorData = await response.json();
        console.log('Error Response Data:', errorData);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If parsing JSON fails, use the status text
        console.log('Error parsing response:', e);
        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      status: 'uploaded',
      message: 'File uploaded successfully',
      id: data.id,
      name: data.name,
      url: data.url,
      size: data.size,
      file_type: data.file_type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to upload file'
    };
  }
};
