import { FC, useContext, useState } from "react";
import { PenpotContext } from "../penpot/PenpotContext.ts";
import { PluginTheme } from "../../model/material.ts";
import { ThemeSelector } from "../theme-selector/ThemeSelector.tsx";
import { ToastContext } from "../toast-loader/ToastContext.ts";

const SwapValuesForm: FC = () => {
  const penpotContext = useContext(PenpotContext);
  const toastContext = useContext(ToastContext);
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

  // TODO Use tool service once component is implemented
  // const toolService: ThemeToolsService = new MessageThemeToolsService(
  //   toastContext.update,
  // );
  const isDisabled = toastContext.isProcessing;

  return (
    <>
      <ThemeSelector
        label="Replace theme values of"
        themes={penpotContext.themes}
        disabled={isDisabled}
        currentTheme={themeFrom}
        allowNewTheme={false}
        useColorAsIcon={true}
        onThemeChanged={setThemeFrom}
      />

      <ThemeSelector
        label="with values from"
        themes={themesWith}
        disabled={isDisabled}
        currentTheme={themeWith}
        allowNewTheme={false}
        useColorAsIcon={true}
        onThemeChanged={setThemeWith}
      />
    </>
  );
};

export { SwapValuesForm };
