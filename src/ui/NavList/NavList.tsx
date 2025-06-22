import React, { type FC } from "react";
import styles from "./NavList.module.css";
import { NavListItem, type NavListItemProps } from "./components/NavListItem/NavListItem";

interface NavListProps {
  navList: NavListItemProps[];
}

export const NavList: FC<NavListProps> = (props) => {
  const { navList } = props;
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {navList.map((item) => (
          <NavListItem key={item.path} {...item} />
        ))}
      </ul>
    </nav>
  );
};
