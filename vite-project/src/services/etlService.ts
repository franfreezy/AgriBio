const API_URL = 'http://localhost:8000/api';

export interface ETLResponse {
  status: 'waiting' | 'processing' | 'cleaned' | 'error';
  message: string;
  stats?: {
    row_count: number;
    column_count: number;
    missing_values: { [key: string]: { count: number; percentage: number } };
    duplicates_removed: number;
  };
  output_file?: string;
}

export const uploadFile = async (file: File): Promise<ETLResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to upload file'
    };
  }
};
