import { useModalStore } from "../store/useModalStore";

// Импортируем тип ModalData
type ModalData = {
  [key: string]: unknown;
};

export const useModals = () => {
  // Получаем состояние и actions из модального store
  const { isOpen, modalData, modalType, openModal, closeModal } = useModalStore();

  const onOpenModal = (modalData: ModalData, isOpen: boolean = true) => {
    if (isOpen) {
      openModal(modalData);
    } else {
      closeModal();
    }
  };

  const onCloseModal = () => {
    closeModal();
  };

  return {
    isOpen,
    modalData,
    modalType,
    onOpenModal,
    onCloseModal,
    // Дополнительные методы для удобства
    openModal,
    closeModal,
  };
};
