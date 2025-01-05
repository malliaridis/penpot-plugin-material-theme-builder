import { FC, useContext, useState } from "react";
import { PenpotContext } from "../penpot/PenpotContext.ts";
import { PluginTheme } from "../../model/material.ts";
import { ThemeSelector } from "../theme-selector/ThemeSelector.tsx";

const SwapValuesForm: FC = () => {
  const penpotContext = useContext(PenpotContext);
  const firstTheme = penpotContext.themes[0];
  // Only local themes should be set in themeFrom
  const [themeFrom, setThemeFrom] = useState<PluginTheme | undefined>(
    firstTheme,
  );

  // All themes are allowed in themeWith
  const [themeWith, setThemeWith] = useState<PluginTheme | undefined>();

  const themesWith = penpotContext.allThemes.filter((theme) => {
    // Filter out the themeFrom to prevent replacement
    // of values with the same theme
    return theme.name != themeFrom?.name;
  });

  // TODO Implement isLoading
  const isLoading = false;

  return (
    <>
      <ThemeSelector
        label="Replace theme values of"
        themes={penpotContext.themes}
        disabled={isLoading}
        currentTheme={themeFrom}
        allowNewTheme={false}
        useColorAsIcon={true}
        onThemeChanged={setThemeFrom}
      />

      <ThemeSelector
        label="with values from"
        themes={themesWith}
        disabled={isLoading}
        currentTheme={themeWith}
        allowNewTheme={false}
        useColorAsIcon={true}
        onThemeChanged={setThemeWith}
      />
    </>
  );
};

export { SwapValuesForm };
