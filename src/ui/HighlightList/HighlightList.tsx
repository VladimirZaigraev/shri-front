import React, { type FC } from "react";
import styles from "./HighlightList.module.css";
import cn from "classnames";
import type { AggregateResponse } from "../../api/types";
import { HighlightItem } from "./components/HighlightItem/HighlightItem";

export enum Color {
  white = "white",
  primaryLight = "primaryLight",
}
interface HighlightListProps {
  type: "list" | "grid";
  info: AggregateResponse;
  color?: Color;
}

export const HighlightList: FC<HighlightListProps> = (props) => {
  const { type, info, color = Color.white } = props;

  return (
    <div className={cn(styles.highlightList, styles[type])}>
      {Object.entries(info).map(([key, value]) => (
        <HighlightItem key={key} title={key} value={value} color={color} />
      ))}
    </div>
  );
};
