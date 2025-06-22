import React, { type FC, type ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";
import cn from "classnames";

export type ColorVariant = "green" | "orange" | "white" | "black" | "yellow";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: ColorVariant;
  type?: "button" | "submit";
  disabled?: boolean;
}

export const BaseButton: FC<ButtonProps> = (props) => {
  const { children, color = "green", type = "button", disabled = false, ...rest } = props;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className={cn(styles.baseButton, styles[color], disabled && styles.disabled)}
    >
      {children}
    </button>
  );
};
