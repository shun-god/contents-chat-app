import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
  },
});

// ページコンポーネントのインポート
import Index from "@/pages/index.tsx";
import WorksPage from "@/pages/WorksPage.tsx"; // 新しいWorksPageをインポート

// ルーティングの設定
const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/works", // 新しいルート
    element: <WorksPage />, // WorksPageを対応させる
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);