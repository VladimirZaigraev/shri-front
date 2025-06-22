import React from "react";
import { RouterProvider } from "react-router-dom";
import "./App.module.css";
import { routes } from "./routes/routes";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <RouterProvider router={routes} />
      <div id="portal"></div>
    </div>
  );
}

export default App;
