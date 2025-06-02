import React, { Suspense } from "react"; // lazy は main.tsx で使用するためここでは不要な場合も
import { Outlet } from "react-router-dom"; // Routes, Route, Navigate を削除し、Outlet をインポート
import { CircularProgress, Box } from "@mui/material";
import { SnackbarProvider } from "notistack";

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
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
        <Outlet /> {/* <Routes> の代わりに <Outlet /> を使用 */}
      </Suspense>
    </SnackbarProvider>
  );
};

export default App;