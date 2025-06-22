import { getUrl } from "../utils/getUrl";
import type { ApiClientConfig } from "./types";

// Класс для работы с API ошибками
export class ApiError extends Error {
  public status: number;
  public response?: Response;

  constructor(message: string, status: number, response?: Response) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

// Базовый HTTP клиент
export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  // Универсальный метод для HTTP запросов
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...this.config.headers,
        ...options.headers,
      },
    };

    const response = await fetch(url, requestOptions);
    return this.handleResponse<T>(response);
  }

  // Обработка ответа с проверкой статуса
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // Если не удалось распарсить JSON, используем статус текст
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiError(errorMessage, response.status, response);
    }

    // Проверяем тип контента для правильного парсинга
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    // Для CSV файлов возвращаем текст
    if (contentType?.includes("text/csv") || contentType?.includes("text/plain")) {
      return response.text() as unknown as T;
    }

    return response.text() as unknown as T;
  }

  // GET запрос
  public async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });

      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    return this.request<T>(url, { method: "GET" });
  }

  // POST запрос
  public async post<T>(endpoint: string, data?: unknown, options?: { body: FormData }): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  // POST запрос для потоковых данных (возвращает Response без обработки)
  public async postStream(
    endpoint: string,
    params?: Record<string, unknown>,
    options?: { body: FormData; headers?: Record<string, string> }
  ): Promise<Response> {
    let url = `${this.config.baseURL}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });

      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        ...this.config.headers,
        ...options?.headers,
      },
      body: options?.body,
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiError(errorMessage, response.status, response);
    }

    return response;
  }
}

export const apiClient = new ApiClient({
  baseURL: getUrl(),
});
