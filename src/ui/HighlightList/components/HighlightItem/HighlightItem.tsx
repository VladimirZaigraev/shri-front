import React, { type FC } from "react";
import styles from "./HighlightItem.module.css";
import cn from "classnames";
import { Color } from "../../HighlightList";

interface HighlightItemProps {
  title: string;
  value: string | number;
  color?: Color;
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
  const { title, value, color = "white" } = props;

  const createDate = (date: number) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();

    // Способ 1: Использование toLocaleDateString с русской локалью
    const month = dateObj.toLocaleDateString("ru-RU", { month: "long" });

    return `${day} ${month}`;
  };

  return (
    <div
      className={cn(
        styles.highlightItem,
        color === Color.white && styles.highlightItem_white,
        color === Color.primaryLight && styles.highlightItem_primaryLight
      )}
    >
      <div className={styles.highlightItem__value}>
        {title === "big_spent_at" || title === "less_spent_at" ? createDate(value as number) : value}
      </div>
      <div className={styles.highlightItem__title}>{ConvertTitle[title as keyof typeof ConvertTitle]}</div>
    </div>
  );
};
