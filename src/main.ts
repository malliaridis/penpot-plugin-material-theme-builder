import "./style.css";
import { MessageData, PenpotData } from "./model.ts";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

document
  .querySelector("[data-handler='generate-theme']")
  ?.addEventListener("click", () => {
    // send message to plugin.ts
    parent.postMessage("generate-theme", "*");
  });

// Listen plugin.ts messages
window.addEventListener("message", (event: MessageEvent<MessageData>) => {
  if (event.data.source === "penpot") {
    document.body.dataset.theme = (event.data as PenpotData).theme;
  }
});
