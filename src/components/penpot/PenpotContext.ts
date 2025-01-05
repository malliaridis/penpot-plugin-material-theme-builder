import { createContext } from "react";
import { PluginTheme } from "../../model/material.ts";
import { Shape } from "@penpot/plugin-types";

interface IPenpotContext {
  /**
   * Array that holds all themes from local and shared libraries.
   */
  allThemes: PluginTheme[];
  /**
   * Array that holds only local themes. The plugin may modify these themes
   * internally via {@link setThemes}.
   */
  themes: PluginTheme[];
  /**
   * Allows modification of internal {@link themes} state. Use this function
   * with caution, as this may cause inconsistent state.
   *
   * @param themes The themes state.
   */
  setThemes: (themes: PluginTheme[]) => void;
  /**
   * Current selection as reported by penpot.
   */
  currentSelection: Shape[];
  /**
   * Refresh the themes currently loaded.
   */
  refreshThemes: () => void;
}

const PenpotContext = createContext<IPenpotContext>({
  allThemes: [],
  themes: [],
  currentSelection: [],
  setThemes: () => undefined,
  refreshThemes: () => undefined,
});

export { PenpotContext };
export type { IPenpotContext };
