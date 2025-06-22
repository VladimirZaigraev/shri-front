import { ApiError } from "./client";
import type { ApiErrorResponse } from "./types";

/**
 * Обработчик API ошибок
 */
export class ErrorHandler {
  /**
   * Обрабатывает API ошибку и возвращает пользовательское сообщение
   * @param error - ошибка для обработки
   * @returns объект с информацией об ошибке
   */
  static handleApiError(error: unknown): ApiErrorResponse {
    // Если это наша кастомная ApiError
    if (error instanceof ApiError) {
      return {
        status: error.status as ApiErrorResponse["status"],
        message: this.getErrorMessage(error.status),
        error: { error: error.message },
      };
    }

    // Если это обычная ошибка JavaScript
    if (error instanceof Error) {
      return {
        status: 500,
        message: "Произошла неожиданная ошибка",
        error: { error: error.message },
      };
    }

    // Неизвестная ошибка
    return {
      status: 500,
      message: "Произошла неизвестная ошибка",
      error: { error: "Unknown error" },
    };
  }

  /**
   * Логирует ошибку в консоль (в продакшене можно отправлять в систему мониторинга)
   * @param error - ошибка для логирования
   * @param context - контекст, в котором произошла ошибка
   */
  static logError(error: unknown, context: string = "API"): void {
    const errorInfo = this.handleApiError(error);

    console.error(`[${context}] Error:`, {
      status: errorInfo.status,
      message: errorInfo.message,
      originalError: error,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Возвращает пользовательское сообщение на основе статуса ошибки
   * @param status - HTTP статус
   * @returns пользовательское сообщение
   */
  private static getErrorMessage(status: number): string {
    if (status >= 500) return "Ошибка сервера. Попробуйте позже.";
    if (status >= 400) return "Ошибка запроса. Проверьте данные.";
    return "Произошла ошибка при выполнении запроса.";
  }
}
