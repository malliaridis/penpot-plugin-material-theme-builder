import "./style.css";
import { Message, PenpotMessage } from "./model/message.ts";

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
      "input-source-color",
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

// Listen plugin.ts messages
window.addEventListener("message", (event: MessageEvent<Message>) => {
  if (event.data.type === "penpot") {
    const message = event.data as PenpotMessage;
    document.body.dataset.theme = message.data.theme;
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
