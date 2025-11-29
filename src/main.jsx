import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { EnvProvider } from "./context/EnvContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <EnvProvider>
        <App />
      </EnvProvider>
    </ThemeProvider>
  </StrictMode>
);
