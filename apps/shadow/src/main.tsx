import { Box, createTheme, CssBaseline, Paper, ThemeProvider, useMediaQuery } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Signup from "./Signup";

function App() {

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Paper square elevation={0}>
        <BrowserRouter>
          <Routes>
            <Route index element={<h1>404</h1>} />
            <Route path=":group/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </Paper>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <React.Fragment>
      <CssBaseline />
      <App />
    </React.Fragment>
  </React.StrictMode>,
  document.getElementById("root")
);
