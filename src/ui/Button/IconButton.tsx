import React, { type FC, type ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";
import cn from "classnames";
import { Icon } from "../Icon/Icon";
import { type IconName } from "../../assets/icons";

export type ColorVariant = "green" | "orange" | "white" | "black" | "yellow";
export type Size = "sm" | "md" | "lg";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: IconName;
  size: Size;
  color?: ColorVariant;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel: string; // Обязательно для accessibility
}

export const IconButton: FC<IconButtonProps> = (props) => {
  const { icon, size, color = "green", type = "button", disabled = false, ariaLabel, ...rest } = props;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(styles.iconButton, styles[color], disabled && styles.disabled)}
    >
      <Icon name={icon} size={size} />
    </button>
  );
};
