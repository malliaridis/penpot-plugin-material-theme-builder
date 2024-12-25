import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.tsx";
import { Message, PenpotMessage } from "./model/message.ts";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

// Listen plugin.ts messages
window.addEventListener("message", (event: MessageEvent<Message>) => {
  switch (event.data.type) {
    case "penpot": {
      const message = event.data as PenpotMessage;
      document.body.dataset.theme = message.data.theme;
      break;
    }
  }
});

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Root element not found");
}
