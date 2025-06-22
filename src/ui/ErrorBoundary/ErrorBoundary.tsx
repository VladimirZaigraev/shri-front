import React, { Component } from "react";
import type { ErrorInfo } from "react";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorText: string | null;
  errorInfo: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorText: null, errorInfo: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorText: error.message, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary произошла ошибка: ", error, errorInfo);
    this.setState({ errorInfo: errorInfo.componentStack || null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorBoundaryContent}>
            <p>Error: {this.state.errorText}</p>
            <p>Info: {this.state.errorInfo}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
