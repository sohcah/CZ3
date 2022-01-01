import { Box, createTheme, CssBaseline, Paper, ThemeProvider, useMediaQuery } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Editor from "./Editor";
import "./index.css";
import Signup from "./Signup";

function checkParamsForCode() {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  if (code) {
    localStorage.CuppaZeeToken = code;
    searchParams.delete("code");
    location.replace("?" + searchParams.toString())
  }
}

checkParamsForCode();

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
            <Route path=":group/:game_id/signup" element={<Signup />} />
            <Route path=":group/:game_id/editor" element={<Editor />} />
            <Route path=":group/:game_id/roster" element={<Editor />} />
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
