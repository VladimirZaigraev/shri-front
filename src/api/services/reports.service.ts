import { apiClient } from "../client";
import type { ReportParams, ReportResponse } from "../types";

/**
 * Сервис для работы с отчетами
 */
export class ReportsService {
  /**
   * Генерирует CSV отчет с заданными параметрами
   * @param params - параметры для генерации отчета
   * @returns Promise с CSV данными как строкой
   */
  static async generateReport(params: ReportParams): Promise<ReportResponse> {
    return apiClient.get<ReportResponse>("/report", {
      size: params.size,
      withErrors: params.withErrors || "off",
      maxSpend: params.maxSpend || 1000,
    });
  }

  /**
   * Скачивает отчет как файл
   * @param params - параметры для генерации отчета
   * @param filename - имя файла для скачивания
   */
  static async downloadReport(params: ReportParams, filename: string = "report.csv"): Promise<void> {
    try {
      const csvData = await this.generateReport(params);

      // Создаем Blob с CSV данными
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

      // Создаем ссылку для скачивания
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";

      // Добавляем в DOM и кликаем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Освобождаем память
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при скачивании отчета:", error);
      throw error;
    }
  }

  /**
   * Валидация параметров отчета
   * @param params - параметры для проверки
   * @returns объект с результатом валидации
   */
  static validateReportParams(params: Partial<ReportParams>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Проверяем обязательный параметр size
    if (!params.size || typeof params.size !== "number") {
      errors.push("Размер отчета (size) обязателен и должен быть числом");
    } else if (params.size <= 0) {
      errors.push("Размер отчета должен быть больше 0");
    }

    // Проверяем withErrors если передан
    if (params.withErrors && !["on", "off"].includes(params.withErrors)) {
      errors.push('Параметр withErrors должен быть "on" или "off"');
    }

    // Проверяем maxSpend если передан
    if (params.maxSpend && (typeof params.maxSpend !== "number" || params.maxSpend < 0)) {
      errors.push("Максимальная сумма расходов должна быть положительным числом");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
