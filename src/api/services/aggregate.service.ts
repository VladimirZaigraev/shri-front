import { apiClient } from "../client";
import type { AggregateParams, AggregateResponse } from "../types";

/**
 * Сервис для агрегации данных
 */
export class AggregateService {
  /**
   * Агрегирует данные с заданными параметрами
   * @param params - параметры для агрегации
   * @returns Promise с агрегированными данными
   */
  static async aggregateData(params: AggregateParams, body: FormData): Promise<AggregateResponse> {
    return apiClient.post<AggregateResponse>("/aggregate", params, { body });
  }

  /**
   * Потоковая агрегация данных
   * @param file - файл для обработки
   * @param rows - количество строк для обработки
   * @returns Response для чтения потока
   */
  static async aggregateDataStream(file: File, rows: number): Promise<Response> {
    // Валидация параметров
    const validation = this.validateAggregateParams({ rows });
    if (!validation.isValid) {
      throw new Error(`Ошибки валидации: ${validation.errors.join(", ")}`);
    }

    // Валидация файла
    if (!file) {
      throw new Error("Файл обязателен для агрегации");
    }

    const formData = new FormData();
    formData.append("file", file);

    return apiClient.postStream("/aggregate", { rows }, { body: formData });
  }

  /**
   * Валидация параметров агрегации
   * @param params - параметры для проверки
   * @returns объект с результатом валидации
   */
  static validateAggregateParams(params: Partial<AggregateParams>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Проверяем обязательный параметр rows
    if (!params.rows || typeof params.rows !== "number") {
      errors.push("Количество строк (rows) обязательно и должно быть числом");
    } else if (params.rows <= 0) {
      errors.push("Количество строк должно быть больше 0");
    } else if (!Number.isInteger(params.rows)) {
      errors.push("Количество строк должно быть целым числом");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Проверяет, является ли число валидным количеством строк
   * @param rows - количество строк для проверки
   * @returns true если валидно
   */
  static isValidRowsCount(rows: unknown): rows is number {
    return typeof rows === "number" && Number.isInteger(rows) && rows > 0;
  }
}
