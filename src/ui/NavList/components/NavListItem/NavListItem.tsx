import React, { type FC } from "react";
import styles from "./NavListItem.module.css";
import { NavLink } from "react-router-dom";
import Icon from "../../../Icon";
import type { IconName } from "../../../../assets/icons";

export interface NavListItemProps {
  path: string;
  title: string;
  icon: IconName;
}

export const NavListItem: FC<NavListItemProps> = (props) => {
  const { path, title, icon } = props;
  return (
    <li className={styles.navListItem}>
      <NavLink
        to={path}
        className={({ isActive }) => `${styles.navListItemLink} ${isActive ? styles.navListItemLinkActive : ""}`}
      >
        <Icon name={icon} className={styles.navListItemIcon} size={"lg"} />
        <span className={styles.navListItemTitle}>{title}</span>
      </NavLink>
    </li>
  );
};
