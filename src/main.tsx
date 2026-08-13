import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error handler to catch and prevent cross-origin script error noise from breaking the app preview
if (typeof window !== "undefined") {
  window.addEventListener(
    "error",
    (event) => {
      // Third-party scripts (like Disqus or iframe widgets) trigger "Script error." on window.onerror
      if (
        event.message === "Script error." ||
        (typeof event.message === "string" && event.message.toLowerCase().includes("disqus"))
      ) {
        console.warn("Handled cross-origin script event:", event.message);
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
