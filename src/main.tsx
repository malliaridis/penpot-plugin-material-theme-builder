import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App.tsx";
import {
  Message,
  PenpotData,
  PenpotThemeData,
  PluginData,
} from "./model/message.ts";
import { PenpotContextProvider } from "./components/penpot/PenpotContextProvider.tsx";

// get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

const rootElement = document.getElementById("root");

const fetchInitialState = () => {
  parent.postMessage(
    {
      source: "plugin",
      type: "load-local-library-colors",
    } as Message<PluginData>,
    "*",
  );
};

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <PenpotContextProvider>
        <App />
      </PenpotContextProvider>
    </StrictMode>,
  );

  fetchInitialState();
} else {
  console.error("Root element not found");
}

// Listen to theme changes from plugin.ts
window.addEventListener(
  "message",
  (event: MessageEvent<Message<PenpotData>>) => {
    if (event.data.source === "penpot" && event.data.type === "theme-changed") {
      document.body.dataset.theme = (event.data.data as PenpotThemeData).theme;
    }
  },
);
