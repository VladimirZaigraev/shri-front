import React, { type FC } from "react";
import styles from "./HighlightList.module.css";
import cn from "classnames";
import type { AggregateResponse } from "../../api/types";
import { HighlightItem } from "./components/HighlightItem/HighlightItem";

interface HighlightListProps {
  type: "list" | "grid";
  info: AggregateResponse;
}

export const HighlightList: FC<HighlightListProps> = (props) => {
  const { type, info } = props;

  return (
    <div className={cn(styles.highlightList, styles[type])}>
      {Object.entries(info).map(([key, value]) => (
        <HighlightItem key={key} title={key} value={value} />
      ))}
    </div>
  );
};
