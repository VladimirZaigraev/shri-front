import styles from "./Loader.module.css";
import Icon from "../Icon";
import cn from "classnames";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
}

export const Loader: React.FC<LoaderProps> = ({ size = "lg" }) => {
  return (
    <div className={cn(styles.loader, styles[size])}>
      <Icon name="loader" size={size} />
    </div>
  );
};
