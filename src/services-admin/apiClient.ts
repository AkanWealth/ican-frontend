// apiClient.ts
import { AxiosInstance, AxiosRequestConfig } from "axios";
import authService, { debug as authDebug } from "./authService";

class ApiClient {
  private client: AxiosInstance;
  private debug = authDebug; // Use the imported debug function

  constructor() {
    this.debug(`Initializing API Client`);
    // Use the authenticated axios instance from authService
    this.client = authService.authAxios;
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    this.debug(`Making request with config:`, {url: config.url, method: config.method});
    const response = await this.client.request<T>(config);
    return response.data;
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
  
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;