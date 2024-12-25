import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.tsx";
import {
  ColorValueChangedMessage,
  Message,
  PenpotMessage,
} from "./model/message.ts";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

// Listen plugin.ts messages
window.addEventListener("message", (event: MessageEvent<Message>) => {
  const sourceColorInputField = document.getElementById(
    "input-source-color-value",
  ) as HTMLInputElement;

  const sourceColorBlockInputBlock = document.getElementById(
    "input-source-color-block",
  ) as HTMLInputElement;

  switch (event.data.type) {
    case "penpot": {
      const message = event.data as PenpotMessage;
      document.body.dataset.theme = message.data.theme;
      break;
    }
    case "color-value-changed": {
      const message = event.data as ColorValueChangedMessage;
      sourceColorInputField.value = message.data.color;
      sourceColorBlockInputBlock.value = message.data.color;
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
