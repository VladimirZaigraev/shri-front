import React, { type FC } from "react";
import { icons, type IconName } from "../../assets/icons";
import styles from "./Icon.module.css";

type Props = {
  name: IconName;
  className?: string;
  size: "sm" | "md" | "lg";
};

export const Icon: FC<Props> = (props) => {
  const { name, className = "", size } = props;

  // Получаем компонент иконки из мап
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Иконка с названием "${name}" не найдена`);
    return null;
  }

  return (
    <div className={`${styles.icon} ${styles[`icon--${size}`]} ${className}`}>
      <IconComponent />
    </div>
  );
};
