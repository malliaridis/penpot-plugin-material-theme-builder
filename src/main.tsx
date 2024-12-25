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

document
  .querySelector("[data-handler='generate-theme']")
  ?.addEventListener("click", () => {
    const themeNameInputField = document.getElementById(
      "input-theme-name",
    ) as HTMLInputElement;

    const sourceColorInputField = document.getElementById(
      "input-source-color-value",
    ) as HTMLInputElement;

    const themeNameValue = themeNameInputField.value;

    sendMessage({
      type: "generate-theme",
      data: {
        themeName: themeNameValue != "" ? themeNameValue : "material-theme",
        sourceColorHex: sourceColorInputField.value,
      },
    });
  });

document
  .getElementById("input-source-color-value")
  ?.addEventListener("blur", () => {
    const themeNameInputField = document.getElementById(
      "input-theme-name",
    ) as HTMLInputElement;

    const sourceColorInputField = document.getElementById(
      "input-source-color-value",
    ) as HTMLInputElement;

    const sourceColorBlockInputBlock = document.getElementById(
      "input-source-color-block",
    ) as HTMLInputElement;

    const themeNameValue = themeNameInputField.value;
    const inputValue = sourceColorInputField.value;

    if (inputValue) {
      sendMessage({
        type: "validate-and-set-color",
        data: {
          themeName: themeNameValue != "" ? themeNameValue : "material-theme",
          sourceColorRaw: sourceColorInputField.value,
        },
      });
    } else {
      // Set color from block if field is left empty.
      sourceColorInputField.value = sourceColorBlockInputBlock.value;
    }
  });

document
  .getElementById("input-source-color-block")
  ?.addEventListener("blur", () => {
    const themeNameInputField = document.getElementById(
      "input-theme-name",
    ) as HTMLInputElement;

    const sourceColorInputField = document.getElementById(
      "input-source-color-value",
    ) as HTMLInputElement;

    const sourceColorBlockInputBlock = document.getElementById(
      "input-source-color-block",
    ) as HTMLInputElement;

    const themeNameValue = themeNameInputField.value;
    const inputValue = sourceColorBlockInputBlock.value;

    if (inputValue) {
      sendMessage({
        type: "validate-and-set-color",
        data: {
          themeName: themeNameValue != "" ? themeNameValue : "material-theme",
          sourceColorRaw: sourceColorBlockInputBlock.value,
        },
      });
    } else {
      // Set color from block if field is left empty.
      sourceColorBlockInputBlock.value = sourceColorInputField.value;
    }
  });

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

/**
 * Sends a well-defined message to plugin.ts
 *
 * @param message The message to send.
 */
function sendMessage(message: Message) {
  parent.postMessage(message, "*");
}

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
