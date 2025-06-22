import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../../../assets/logo/shri.svg?url";
import logoYoung from "../../../../assets/logo/young.svg?url";
import { NavList } from "../../../../ui";
import type { NavListItemProps } from "../../../../ui/NavList/components/NavListItem/NavListItem";

const NAV_LIST: NavListItemProps[] = [
  {
    title: "CSV Аналитик",
    path: "csv-analyzer",
    icon: "mage-upload",
  },
  {
    title: "CSV Генератор",
    path: "csv-generator",
    icon: "metric-job",
  },
  {
    title: "История",
    path: "history",
    icon: "solar-history",
  },
];
export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <NavLink to="/" className={styles.logoLink}>
          <img src={logo} alt="logo" className={styles.logoShri} />
          <img src={logoYoung} alt="logo" className={styles.logoYoung} />
        </NavLink>
        <h1 className={styles.headerTitle}>Межгалактическая аналитика</h1>
      </div>
      <NavList navList={NAV_LIST} />
    </header>
  );
};
