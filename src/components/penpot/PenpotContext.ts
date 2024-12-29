import { createContext } from "react";
import { PluginTheme } from "../../model/material.ts";

interface IPenpotContext {
  themes: PluginTheme[];
  setThemes: (themes: PluginTheme[]) => void;
}

const PenpotContext = createContext<IPenpotContext>({
  themes: [],
  setThemes: () => undefined,
});

export { PenpotContext };
export type { IPenpotContext };
