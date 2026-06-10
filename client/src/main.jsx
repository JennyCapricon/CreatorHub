import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MuiThemeWrapper from "./components/MuiThemeWrapper";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MuiThemeWrapper>
          <App />
        </MuiThemeWrapper>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
