import { PenpotContext } from "./PenpotContext.ts";
import { ReactNode, useEffect, useState } from "react";
import {
  Message,
  MessageData,
  PenpotColorsData,
  PluginData,
} from "../../model/message.ts";
import { PluginTheme } from "../../model/material.ts";
import { mapColorsToThemes } from "../../utils/color-utils.ts";

interface PenpotContextProviderProps {
  children: ReactNode;
}

const PenpotContextProvider: React.FC<PenpotContextProviderProps> = ({
  children,
}) => {
  const [themes, setThemes] = useState<PluginTheme[]>([]);

  const sortBeforeSetThemes = (themes: PluginTheme[]) => {
    setThemes(
      themes.sort((theme1, theme2) => theme1.name.localeCompare(theme2.name)),
    );
  };

  // Listen plugin.ts messages
  window.addEventListener(
    "message",
    (event: MessageEvent<Message<MessageData>>) => {
      if (event.data.source != "penpot") {
        // Ignore any event not coming from penpot
        return;
      }

      switch (event.data.type) {
        case "library-colors-fetched": {
          const data = event.data.data as PenpotColorsData;
          const themes = mapColorsToThemes(data.colors);
          sortBeforeSetThemes(themes);
          break;
        }
      }
    },
  );

  useEffect(() => {
    // Request library colors to initialize themes
    parent.postMessage(
      {
        source: "plugin",
        type: "load-local-library-colors",
      } as Message<PluginData>,
      "*",
    );
  }, []);

  return (
    <PenpotContext.Provider value={{ themes, setThemes: sortBeforeSetThemes }}>
      {children}
    </PenpotContext.Provider>
  );
};

export { PenpotContextProvider };
