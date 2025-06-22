import React, { type FC } from "react";
import { createPortal } from "react-dom";
import { useModals } from "../../hooks/useModals";
import styles from "./ModalWrapper.module.css";
import { IconButton } from "../Button";

interface ModalWrapperProps {
  children: React.ReactNode;
}

export const ModalWrapper: FC<ModalWrapperProps> = (props) => {
  const { children } = props;
  const modals = useModals();

  if (!modals.isOpen) return null;

  const portal = document.getElementById("portal")!;

  const handleClose = () => {
    modals.closeModal();
  };

  const onContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return createPortal(
    <div className={styles.modalWrapper} onClick={handleClose}>
      <div className={styles.modalWrapper__content} onClick={onContentClick}>
        <div className={styles.modalWrapper__content__button}>
          <IconButton icon="proicons-cancel" size="lg" ariaLabel="close" onClick={handleClose} color="black" />
        </div>
        <div className={styles.modalWrapper__content__main}>{children}</div>
      </div>
    </div>,
    portal
  );
};
