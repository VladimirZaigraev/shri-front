import { useModals } from "../../hooks/useModals";
import { type HistoryItem as HistoryItemType } from "../../store/useHistoryStore";
import { HighlightList, ModalWrapper } from "../../ui";
import { type AggregateResponse } from "../../api/types";
import styles from "./ModalHistory.module.css";
import { Color } from "../../ui/HighlightList/HighlightList";

export const ModalHistory = () => {
  const modals = useModals();

  // Получаем данные из modalData, проверяя их существование
  const modalData = modals.modalData as { id: string; content: HistoryItemType } | null;
  const historyItem = modalData?.content;

  console.log("Modal data:", modalData);
  console.log("History item:", historyItem);

  if (!historyItem) {
    return (
      <ModalWrapper>
        <div className={styles.modalHistory}>
          <p>Данные не найдены</p>
        </div>
      </ModalWrapper>
    );
  }

  let parsedResult: AggregateResponse | null = null;
  if (historyItem.result) {
    parsedResult = JSON.parse(historyItem.result) as AggregateResponse;
  }

  if (!parsedResult) {
    return (
      <ModalWrapper>
        <div className={styles.modalHistory}>
          <p>Результат не найден или поврежден</p>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper>
      <div className={styles.modalHistory}>
        <HighlightList type="list" info={parsedResult} color={Color.primaryLight} />
      </div>
    </ModalWrapper>
  );
};
