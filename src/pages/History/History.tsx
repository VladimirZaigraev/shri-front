import { ModalHistory } from "../../components/ModalHistory/ModalHistory";
import { useModals } from "../../hooks/useModals";
import { type HistoryItem as HistoryItemType, useHistoryStore } from "../../store/useHistoryStore";
import { BaseButton, HistoryItem, PageWrapper } from "../../ui";
import styles from "./History.module.css";
import { useNavigate } from "react-router-dom";

export const History = () => {
  const navigate = useNavigate();
  const modals = useModals();
  const { items, clearHistory, removeItem } = useHistoryStore();

  const handleGenerateMore = () => {
    navigate("/csv-analyzer");
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  const handleOpenModal = (info: HistoryItemType) => {
    console.log(info);
    modals.openModal({
      id: info.id,
      content: info,
    });
  };

  return (
    <PageWrapper>
      <div className={styles.history}>
        <div className={styles.history_list}>
          {items?.map((item) => (
            <HistoryItem
              key={item.id}
              info={item}
              onDelete={() => removeItem(item.id)}
              onOpenModal={() => handleOpenModal(item)}
            />
          ))}
        </div>
        {items.length > 0 && (
          <div className={styles.history_buttons}>
            <BaseButton onClick={handleGenerateMore}>Сгенерировать больше</BaseButton>
            <BaseButton color="black" onClick={handleClearHistory}>
              Очистить всё
            </BaseButton>
          </div>
        )}
        {items.length === 0 && <span className={styles.history_empty}>Здесь появятся ваши отчёты</span>}
      </div>
      {modals.isOpen && <ModalHistory />}
    </PageWrapper>
  );
};
