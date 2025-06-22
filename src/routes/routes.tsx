import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../components";
import { Analytics, CsvGenerator } from "../pages";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/csv-analyzer" />,
      },
      {
        path: "/csv-analyzer",
        element: <Analytics />,
      },
      {
        path: "/csv-generator",
        element: <CsvGenerator />,
      },
      {
        path: "/history",
        element: <div>History</div>,
      },
    ],
  },
]);
