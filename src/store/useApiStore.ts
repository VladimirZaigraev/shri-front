import { create } from "zustand";
import { api, ErrorHandler } from "../api";
import type { ReportParams, AggregateParams, ApiErrorResponse } from "../api";

// Состояние store
interface ApiState {
  // Отдельные loading состояния для каждого запроса
  generateReportLoading: boolean;
  aggregateDataLoading: boolean;

  // Данные и ошибки для отчетов
  reports: {
    data: string | null;
    error: ApiErrorResponse | null;
  };

  // Данные и ошибки для агрегации
  aggregate: {
    data: unknown | null;
    error: ApiErrorResponse | null;
  };
}

// Actions для store
interface ApiActions {
  // Операции с отчетами
  generateReport: (params: ReportParams) => Promise<string | null>;
  downloadReport: (params: ReportParams, filename?: string) => Promise<void>;

  // Операции с агрегацией
  aggregateData: (params: AggregateParams) => Promise<unknown | null>;

  // Очистка данных
  clearReportData: () => void;
  clearAggregateData: () => void;
  clearAllErrors: () => void;
}

export const useApiStore = create<ApiState & ApiActions>((set, get) => ({
  // Начальное состояние
  generateReportLoading: false,
  aggregateDataLoading: false,

  reports: {
    data: null,
    error: null,
  },

  aggregate: {
    data: null,
    error: null,
  },

  // Генерация отчета
  generateReport: async (params: ReportParams): Promise<string | null> => {
    // Если уже загружается - выходим
    if (get().generateReportLoading) {
      return null;
    }

    // Начинаем загрузку
    set({
      generateReportLoading: true,
      reports: { data: null, error: null },
    });

    try {
      // Валидация параметров
      const validation = api.reports.validateReportParams(params);
      if (!validation.isValid) {
        throw new Error(`Ошибки валидации: ${validation.errors.join(", ")}`);
      }

      // Выполняем запрос
      const csvData = await api.reports.generateReport(params);

      // Успешное завершение
      set({
        generateReportLoading: false,
        reports: { data: csvData, error: null },
      });

      return csvData;
    } catch (error) {
      // Обработка ошибки
      const errorInfo = ErrorHandler.handleApiError(error);
      ErrorHandler.logError(error, "GenerateReport");

      set({
        generateReportLoading: false,
        reports: { data: null, error: errorInfo },
      });

      return null;
    }
  },

  // Скачивание отчета
  downloadReport: async (params: ReportParams, filename?: string): Promise<void> => {
    // Если уже загружается - выходим
    if (get().generateReportLoading) {
      return;
    }

    set({ generateReportLoading: true });

    try {
      // Используем существующие данные или генерируем новые
      let csvData = get().reports.data;

      if (!csvData) {
        // Валидация параметров
        const validation = api.reports.validateReportParams(params);
        if (!validation.isValid) {
          throw new Error(`Ошибки валидации: ${validation.errors.join(", ")}`);
        }

        csvData = await api.reports.generateReport(params);

        // Обновляем данные в store
        set((state) => ({
          reports: { ...state.reports, data: csvData },
        }));
      }

      if (csvData) {
        // Создаем и скачиваем файл
        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename || "report.csv";
        link.style.position = "fixed";
        link.style.left = "-9999px";

        document.body.appendChild(link);
        link.click();

        // Очищаем ресурсы
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      }

      set({ generateReportLoading: false });
    } catch (error) {
      // Обработка ошибки
      const errorInfo = ErrorHandler.handleApiError(error);
      ErrorHandler.logError(error, "DownloadReport");

      set({
        generateReportLoading: false,
        reports: { data: null, error: errorInfo },
      });
    }
  },

  // Агрегация данных
  aggregateData: async (params: AggregateParams): Promise<unknown | null> => {
    // Если уже загружается - выходим
    if (get().aggregateDataLoading) {
      return null;
    }

    // Начинаем загрузку
    set({
      aggregateDataLoading: true,
      aggregate: { data: null, error: null },
    });

    try {
      // Валидация параметров
      const validation = api.aggregate.validateAggregateParams(params);
      if (!validation.isValid) {
        throw new Error(`Ошибки валидации: ${validation.errors.join(", ")}`);
      }

      // Выполняем запрос
      const result = await api.aggregate.aggregateData(params);

      // Успешное завершение
      set({
        aggregateDataLoading: false,
        aggregate: { data: result, error: null },
      });

      return result;
    } catch (error) {
      // Обработка ошибки
      const errorInfo = ErrorHandler.handleApiError(error);
      ErrorHandler.logError(error, "AggregateData");

      set({
        aggregateDataLoading: false,
        aggregate: { data: null, error: errorInfo },
      });

      return null;
    }
  },

  // Очистка данных отчетов
  clearReportData: () => {
    set({
      reports: { data: null, error: null },
    });
  },

  // Очистка данных агрегации
  clearAggregateData: () => {
    set({
      aggregate: { data: null, error: null },
    });
  },

  // Очистка всех ошибок
  clearAllErrors: () => {
    set((state) => ({
      reports: {
        ...state.reports,
        error: null,
      },
      aggregate: {
        ...state.aggregate,
        error: null,
      },
    }));
  },
}));
