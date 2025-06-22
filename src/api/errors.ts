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
        message: this.getErrorMessage(error.status, error.message),
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
   * Возвращает пользовательское сообщение на основе статуса ошибки
   * @param status - HTTP статус
   * @param originalMessage - оригинальное сообщение ошибки
   * @returns пользовательское сообщение
   */
  private static getErrorMessage(status: number, originalMessage: string): string {
    switch (status) {
      case 400:
        return "Неверные параметры запроса. Проверьте введенные данные.";
      case 401:
        return "Необходима авторизация для выполнения запроса.";
      case 403:
        return "Недостаточно прав для выполнения операции.";
      case 404:
        return "Запрашиваемый ресурс не найден.";
      case 408:
        return "Превышено время ожидания запроса.";
      case 429:
        return "Превышен лимит запросов. Попробуйте позже.";
      case 500:
        return "Внутренняя ошибка сервера. Попробуйте позже.";
      case 502:
        return "Сервер временно недоступен.";
      case 503:
        return "Сервис временно недоступен.";
      default:
        return originalMessage || "Произошла ошибка при выполнении запроса.";
    }
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
   * Проверяет, является ли ошибка сетевой ошибкой
   * @param error - ошибка для проверки
   * @returns true если это сетевая ошибка
   */
  static isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return true;
    }

    if (error instanceof Error && error.name === "AbortError") {
      return true;
    }

    return false;
  }

  /**
   * Проверяет, является ли ошибка ошибкой валидации (400)
   * @param error - ошибка для проверки
   * @returns true если это ошибка валидации
   */
  static isValidationError(error: unknown): boolean {
    return error instanceof ApiError && error.status === 400;
  }

  /**
   * Проверяет, является ли ошибка серверной ошибкой (5xx)
   * @param error - ошибка для проверки
   * @returns true если это серверная ошибка
   */
  static isServerError(error: unknown): boolean {
    return error instanceof ApiError && error.status >= 500;
  }
}
