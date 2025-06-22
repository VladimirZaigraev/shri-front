import { create } from "zustand";

// Типы для модалов
interface ModalData {
  [key: string]: unknown;
}

interface ModalState {
  isOpen: boolean;
  modalData: ModalData | null;
  // Дополнительные поля для расширенной функциональности
  modalId?: string;
  isClosable?: boolean;
  onClose?: () => void;
}

interface ModalActions {
  openModal: (
    modalData: ModalData,
    options?: {
      modalId?: string;
      isClosable?: boolean;
      onClose?: () => void;
    }
  ) => void;
  closeModal: () => void;
  updateModalData: (data: Partial<ModalData>) => void;
}

export const useModalStore = create<ModalState & ModalActions>((set, get) => ({
  // Начальное состояние
  isOpen: false,
  modalData: null,
  modalId: undefined,
  isClosable: true,
  onClose: undefined,

  // Открытие модала с опциями
  openModal: (modalData, options = {}) => {
    set({
      isOpen: true,
      modalData,
      modalId: options.modalId,
      isClosable: options.isClosable ?? true,
      onClose: options.onClose,
    });
  },

  // Закрытие модала
  closeModal: () => {
    const state = get();

    // Вызываем callback перед закрытием, если он есть
    if (state.onClose) {
      state.onClose();
    }

    set({
      isOpen: false,
      modalData: null,
      modalId: undefined,
      isClosable: true,
      onClose: undefined,
    });
  },

  // Обновление данных модала без закрытия
  updateModalData: (data) => {
    const currentData = get().modalData;
    set({
      modalData: currentData ? { ...currentData, ...data } : data,
    });
  },
}));
