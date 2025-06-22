import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import styles from "./PageWrapper.module.css";

interface PageWrapperProps {
  children: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <ErrorBoundary>
      <div className={styles.pageWrapper}>{children}</div>
    </ErrorBoundary>
  );
};

export default PageWrapper;
