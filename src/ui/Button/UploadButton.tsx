import React, { type ButtonHTMLAttributes, type FC } from "react";
import styles from "./button.module.css";
import { IconButton } from "./IconButton";
import cn from "classnames";

import Loader from "../Loader";

enum Type {
  error = "error",
  done = "done",
  loading = "loading",
  process = "process",
  active = "active",
}

interface UploadButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  title?: string;
  onClose?: () => void;
  type: Type;
  subtitle?: string;
  disabled?: boolean;
}

const TYPE_COLOR = {
  error: "orange",
  done: "light-green",
  loading: "primary",
  process: "primary",
  active: "white",
};

const TITLE = {
  error: "Ошибка",
  done: "Done!",
  loading: "Parsing file...",
  process: "File uploaded!",
  active: "Загрузить файл",
};
const SUBTITLE = {
  error: "упс, не то...",
  done: "готово!",
  loading: "идёт парсинг файла",
  process: "файл загружен!",
  active: "или перетащите сюда",
};

export const UploadButton: FC<UploadButtonProps> = (props) => {
  const { title, onClose, type, subtitle, disabled = true, ...rest } = props;

  return (
    <div className={styles.uploadButton}>
      <div className={styles.uploadButton__wrapper}>
        <button
          disabled={disabled}
          className={cn(styles.uploadButton__button, styles[TYPE_COLOR[type]], styles[type], {})}
          {...rest}
        >
          {type === "loading" ? <Loader size="lg" /> : title || TITLE[type]}
        </button>
        {type !== "loading" && (
          <IconButton icon="proicons-cancel" size="lg" ariaLabel="close" color="black" onClick={onClose} />
        )}
      </div>
      <span className={cn(styles.uploadButton__subtitle, type === Type.error && styles.uploadButton__subtitle_error)}>
        {subtitle || SUBTITLE[type]}
      </span>
    </div>
  );
};
