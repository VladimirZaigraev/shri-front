import React, { type FC } from "react";
import styles from "./HighlightItem.module.css";

interface HighlightItemProps {
  [key: string]: string | number;
}

enum ConvertTitle {
  average_spend_galactic = "средние расходы в галактических кредитах",
  big_spent_at = "день года с максимальными расходами",
  big_spent_civ = "цивилизация с максимальными расходами",
  big_spent_value = "максимальная сумма расходов за день",
  less_spent_at = "день года с минимальными расходами",
  less_spent_civ = "цивилизация с минимальными расходами",
  less_spent_value = "минимальная сумма расходов за день",
  rows_affected = "количество обработанных записей",
  total_spend_galactic = "общие расходы в галактических кредитах",
}

export const HighlightItem: FC<HighlightItemProps> = (props) => {
  const { title, value } = props;

  const createDate = (date: number) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();

    // Способ 1: Использование toLocaleDateString с русской локалью
    const month = dateObj.toLocaleDateString("ru-RU", { month: "long" });

    return `${day} ${month}`;
  };

  return (
    <div className={styles.highlightItem}>
      <div className={styles.highlightItem__value}>
        {title === "big_spent_at" || title === "less_spent_at" ? createDate(value as number) : value}
      </div>
      <div className={styles.highlightItem__title}>{ConvertTitle[title as keyof typeof ConvertTitle]}</div>
    </div>
  );
};
