import { type FC } from "react";
import styles from "./HistoryItem.module.css";
import { IconButton } from "../Button";
import type { HistoryItem as HistoryItemType } from "../../store/useHistoryStore";
import Icon from "../Icon";
import cn from "classnames";

interface HistoryItemProps {
  info: HistoryItemType;
  onDelete: () => void;
  onOpenModal: () => void;
}

export const HistoryItem: FC<HistoryItemProps> = (props) => {
  const { info, onDelete, onOpenModal } = props;

  const createDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className={styles.historyItem}>
      <div className={styles.historyItem__info} onClick={onOpenModal}>
        <div className={styles.historyItem__info_box}>
          <Icon name={"file"} size="lg" />
          <div className={styles.historyItem__info_title}>{info.fileName}</div>
        </div>
        <div className={styles.historyItem__info_box}>
          <div className={styles.historyItem__info_title}>{createDate(info.timestamp)}</div>
        </div>
        <div
          className={cn(styles.historyItem__info_box, info.status === "error" && styles.historyItem__info_box_opacity)}
        >
          <div className={styles.historyItem__info_title}>Обработан успешно</div>
          <Icon name={"smile"} size="lg" />
        </div>
        <div
          className={cn(
            styles.historyItem__info_box,
            info.status === "success" && styles.historyItem__info_box_opacity
          )}
        >
          <div className={styles.historyItem__info_title}>Не удалось обработать</div>
          <Icon name={"smileSad"} size="lg" />
        </div>
      </div>
      <IconButton icon={"trash"} onClick={onDelete} size="lg" ariaLabel="remove" color="white" />
    </div>
  );
};
