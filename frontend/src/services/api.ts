import { 
  ApiResponse, 
  CreateGameRequest, 
  CreateGameResponse, 
  SubmitGameRequest, 
  SubmitGameResponse,
  HealthCheckResponse 
} from '../../../shared/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async createGame(params: CreateGameRequest): Promise<CreateGameResponse> {
    const response = await this.request<CreateGameResponse>('/games', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  }

  async submitGame(gameId: string, params: SubmitGameRequest): Promise<SubmitGameResponse> {
    const response = await this.request<SubmitGameResponse>(`/games/${gameId}/submit`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  }

  async checkHealth(): Promise<HealthCheckResponse> {
    const response = await this.request<HealthCheckResponse>('/health');
    
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    
    return response.data;
  }
}

export const apiService = new ApiService();