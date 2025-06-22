import { create } from "zustand";
import { api, ErrorHandler } from "../api";
import type { ReportParams, AggregateParams, ApiErrorResponse, AggregateResponse } from "../api";
import { useHistoryStore } from "./useHistoryStore";

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
    data: AggregateResponse | null;
    error: ApiErrorResponse | null;
    isStreaming: boolean; // Флаг потокового режима
  };
}

// Callback для обновления агрегации
type ProgressCallback = (intermediateData?: AggregateResponse) => void;

// Actions для store
interface ApiActions {
  // Операции с отчетами
  generateReport: (params: ReportParams) => Promise<string | null>;
  downloadReport: (params: ReportParams, filename?: string) => Promise<void>;

  // Операции с агрегацией
  aggregateData: (
    params: AggregateParams,
    body: FormData,
    onProgress?: ProgressCallback
  ) => Promise<AggregateResponse | null>;

  // Потоковая агрегация данных
  aggregateDataStream: (file: File, rows: number, onProgress?: ProgressCallback) => Promise<AggregateResponse | null>;

  // Обновление промежуточных данных агрегации
  updateAggregateData: (data?: AggregateResponse) => void;

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
    isStreaming: false,
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
        link.download = filename || "file_uploaded.csv";
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

  // Агрегация данных (устаревший метод, для совместимости)
  aggregateData: async (
    params: AggregateParams,
    body: FormData,
    onProgress?: ProgressCallback
  ): Promise<AggregateResponse | null> => {
    // Если уже загружается - выходим
    if (get().aggregateDataLoading) {
      return null;
    }

    // Начинаем загрузку
    set({
      aggregateDataLoading: true,
      aggregate: { data: null, error: null, isStreaming: false },
    });

    try {
      // Валидация параметров
      const validation = api.aggregate.validateAggregateParams(params);
      if (!validation.isValid) {
        throw new Error(`Ошибки валидации: ${validation.errors.join(", ")}`);
      }

      // Выполняем запрос
      const result = await api.aggregate.aggregateData(params, body);

      // Успешное завершение
      set({
        aggregateDataLoading: false,
        aggregate: { data: result, error: null, isStreaming: false },
      });

      if (onProgress) {
        onProgress(result);
      }

      return result;
    } catch (error) {
      // Обработка ошибки
      const errorInfo = ErrorHandler.handleApiError(error);
      ErrorHandler.logError(error, "AggregateData");

      // Сохранение ошибки в историю
      const file = body.get("file") as File;
      const fileName = file?.name || "unknown_file";
      useHistoryStore.getState().addItem({
        fileName,
        timestamp: new Date().toISOString(),
        result: null,
        status: "error",
        error: errorInfo.message || "Ошибка обработки файла",
      });

      set({
        aggregateDataLoading: false,
        aggregate: { data: null, error: errorInfo, isStreaming: false },
      });

      return null;
    }
  },

  // Потоковая агрегация данных
  aggregateDataStream: async (
    file: File,
    rows: number,
    onProgress?: ProgressCallback
  ): Promise<AggregateResponse | null> => {
    // Если уже загружается - выходим
    if (get().aggregateDataLoading) {
      return null;
    }

    // Начинаем потоковую загрузку
    set({
      aggregateDataLoading: true,
      aggregate: { data: null, error: null, isStreaming: true },
    });

    try {
      // Выполняем потоковый запрос через сервис
      const response = await api.aggregate.aggregateDataStream(file, rows);

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      // Объект для накопления суммарных данных
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aggregatedResult: Record<string, any> = {};

      // Чтение потокового ответа
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Добавляем новый chunk к буферу
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Обрабатываем полные JSON объекты из буфера
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Сохраняем неполную строку в буфере

        for (const line of lines) {
          if (line.trim()) {
            try {
              const jsonData = JSON.parse(line.trim());

              // Суммируем данные по ключам
              for (const [key, value] of Object.entries(jsonData)) {
                if (typeof value === "number") {
                  // Суммируем числовые значения
                  aggregatedResult[key] = (aggregatedResult[key] || 0) + value;
                } else if (Array.isArray(value)) {
                  // Объединяем массивы
                  aggregatedResult[key] = [...(aggregatedResult[key] || []), ...value];
                } else if (typeof value === "object" && value !== null) {
                  // Для объектов делаем глубокое слияние
                  aggregatedResult[key] = { ...(aggregatedResult[key] || {}), ...value };
                } else {
                  // Для строк и других типов берем последнее значение
                  aggregatedResult[key] = value;
                }
              }

              // Обновляем состояние с промежуточными результатами
              const currentResult = { ...aggregatedResult } as AggregateResponse;
              set((state) => ({
                aggregate: {
                  ...state.aggregate,
                  data: currentResult,
                },
              }));

              // Вызываем callback
              if (onProgress) {
                onProgress(currentResult);
              }
            } catch (parseError) {
              console.warn("Ошибка парсинга строки JSON:", line, parseError);
            }
          }
        }
      }

      // Обрабатываем оставшиеся данные в буфере
      if (buffer.trim()) {
        try {
          const jsonData = JSON.parse(buffer.trim());
          for (const [key, value] of Object.entries(jsonData)) {
            if (typeof value === "number") {
              aggregatedResult[key] = (aggregatedResult[key] || 0) + value;
            } else if (Array.isArray(value)) {
              aggregatedResult[key] = [...(aggregatedResult[key] || []), ...value];
            } else if (typeof value === "object" && value !== null) {
              aggregatedResult[key] = { ...(aggregatedResult[key] || {}), ...value };
            } else {
              aggregatedResult[key] = value;
            }
          }
        } catch (parseError) {
          console.warn("Ошибка парсинга оставшихся данных:", buffer, parseError);
        }
      }

      const finalResult = aggregatedResult as AggregateResponse;

      // Сохранение в историю
      useHistoryStore.getState().addItem({
        fileName: file.name,
        timestamp: new Date().toISOString(),
        result: JSON.stringify(finalResult),
        status: "success",
      });

      // Финальное обновление состояния
      set({
        aggregateDataLoading: false,
        aggregate: {
          data: finalResult,
          error: null,
          isStreaming: false,
        },
      });

      // Финальный callback
      if (onProgress) {
        onProgress(finalResult);
      }

      return finalResult;
    } catch (error) {
      // Обработка ошибки
      const errorInfo = ErrorHandler.handleApiError(error);
      ErrorHandler.logError(error, "AggregateDataStream");

      // Сохранение ошибки в историю
      useHistoryStore.getState().addItem({
        fileName: file.name,
        timestamp: new Date().toISOString(),
        result: null,
        status: "error",
        error: errorInfo.message || "Ошибка обработки файла",
      });

      set({
        aggregateDataLoading: false,
        aggregate: { data: null, error: errorInfo, isStreaming: false },
      });

      return null;
    }
  },

  // Обновление промежуточных данных агрегации
  updateAggregateData: (data?: AggregateResponse) => {
    set((state) => ({
      aggregate: {
        ...state.aggregate,
        ...(data && { data }),
      },
    }));
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
      aggregate: { data: null, error: null, isStreaming: false },
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
