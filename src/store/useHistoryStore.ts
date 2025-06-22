import { create } from "zustand";

export interface HistoryItem {
  id: string;
  fileName: string;
  timestamp: string;
  result: string | null;
  status: "success" | "error";
  error?: string;
}

interface HistoryState {
  items: HistoryItem[];
}

interface HistoryActions {
  addItem: (item: Omit<HistoryItem, "id">) => void;
  removeItem: (id: string) => void;
  clearHistory: () => void;
}

// Ключ для localStorage
const HISTORY_STORAGE_KEY = "uploadHistory";

// Утилита для генерации ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Утилита для загрузки данных из localStorage
const loadHistoryFromStorage = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    // Преобразуем старый формат данных в новый (с id)
    return parsed.map((item: Partial<HistoryItem> & { [key: string]: unknown }) => ({
      id: item.id || generateId(),
      fileName: item.fileName || "unknown_file",
      timestamp: item.timestamp || new Date().toISOString(),
      result: item.result || null,
      status: item.status === "success" || item.status === "error" ? item.status : "error",
      ...(item.error && typeof item.error === "string" && { error: item.error }),
    }));
  } catch (error) {
    console.warn("Ошибка загрузки истории из localStorage:", error);
    return [];
  }
};

// Утилита для сохранения данных в localStorage
const saveHistoryToStorage = (items: HistoryItem[]): void => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Ошибка сохранения истории в localStorage:", error);
  }
};

export const useHistoryStore = create<HistoryState & HistoryActions>((set) => ({
  // Инициализация с данными из localStorage
  items: loadHistoryFromStorage(),

  // Добавление нового элемента в историю
  addItem: (item) => {
    const newItem: HistoryItem = {
      ...item,
      id: generateId(),
    };

    set((state) => {
      const updatedItems = [...state.items, newItem];
      saveHistoryToStorage(updatedItems);
      return { items: updatedItems };
    });
  },

  // Удаление элемента по ID
  removeItem: (id) => {
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== id);
      saveHistoryToStorage(updatedItems);
      return { items: updatedItems };
    });
  },

  // Очистка всей истории
  clearHistory: () => {
    set({ items: [] });
    saveHistoryToStorage([]);
  },
}));
