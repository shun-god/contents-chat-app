import React, { Suspense, lazy } from "react"; // Suspense, lazy をインポート
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme, CircularProgress, Box } from "@mui/material"; // CircularProgress, Box をインポート

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

// レイジーローディングするコンポーネントを定義 (App.tsx と重複しないように注意)
const App = lazy(() => import("./App"));
const IndexPage = lazy(() => import("./pages/index"));
const WorksPage = lazy(() => import("./pages/WorksPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

// ルーティングの設定
const router = createBrowserRouter([
  {
    path: "/", // Appコンポーネントが全てのルートの親となる
    element: <App />,
    // errorElement: <ErrorPage />, // エラーページがあれば設定
    children: [
      {
        index: true, // path: "/" と同じ意味だが、index routeとして推奨
        element: <IndexPage />,
      },
      {
        path: "works", // 相対パスで定義
        element: <WorksPage />,
      },
      {
        path: "chat", // /chat のルート
        element: <ChatPage />,
      },
      {
        path: "chat/:workId", // /chat/:workId のルート
        element: <ChatPage />,
      },
      // 他のルートがあればここに追加
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  </React.StrictMode>
);
