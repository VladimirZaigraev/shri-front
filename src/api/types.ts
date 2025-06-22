// Базовые типы для API ответов
export interface ApiError {
  error: string;
}

// Типы для GET /report endpoint
export interface ReportParams {
  size: number; // required - размер отчета в ГБ
  withErrors?: "on" | "off"; // query, default: 'off' - включать ли ошибки в отчет
  maxSpend?: number; // query, default: 1000 - максимальная сумма расходов
}

export type ReportResponse = string; // CSV файл как строка

// Типы для POST /aggregate endpoint
export interface AggregateParams {
  rows: number; // required - количество строк для промежуточного агрегирования
}

export interface AggregateResponse {
  average_spend_galactic: number;
  big_spent_at: number;
  big_spent_civ: string;
  big_spent_value: number;
  less_spent_at: number;
  less_spent_civ: string;
  less_spent_value: number;
  rows_affected: number;
  total_spend_galactic: number;
}

export type HttpStatus = 200 | 400 | 500;

// Типы для обработки ошибок
export interface ApiErrorResponse {
  status: HttpStatus;
  message: string;
  error?: ApiError;
}

// Тип для конфигурации API клиента
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}
