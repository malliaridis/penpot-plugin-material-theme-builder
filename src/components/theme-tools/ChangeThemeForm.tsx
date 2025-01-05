import { FC, useContext, useState } from "react";
import { PenpotContext } from "../penpot/PenpotContext.ts";
import { PluginTheme } from "../../model/material.ts";
import { ThemeSelector } from "../theme-selector/ThemeSelector.tsx";
import { doThemesMatch } from "../../utils/color-utils.ts";
import {
  MessageThemeToolsService,
  ThemeToolsService,
} from "../../services/ThemeToolsService.ts";
import { ToastContext } from "../toast-loader/ToastContext.ts";

const ChangeThemeForm: FC = () => {
  const penpotContext = useContext(PenpotContext);
  const toastContext = useContext(ToastContext);
  const currentSelection = penpotContext.currentSelection;
  const [toReplace, setToReplace] = useState<PluginTheme | undefined>();
  const [replaceWith, setReplaceWith] = useState<PluginTheme | undefined>();

  const replaceWithThemes = penpotContext.allThemes.filter((theme) => {
    // Filter out the themeFrom to prevent replacement
    // of values with the same theme
    return theme.name != toReplace?.name;
  });

  const updateToReplaceWith = (theme: PluginTheme | undefined) => {
    setToReplace(theme);
    if (replaceWith?.name == theme?.name) setReplaceWith(undefined);
  };

  const toolService: ThemeToolsService = new MessageThemeToolsService(
    toastContext.update,
  );
  const onChangeClicked = () => {
    if (!toReplace || !replaceWith) return;

    void toolService.replaceThemes(
      currentSelection.length > 0,
      toReplace,
      replaceWith,
    );
  };

  const isDisabled = toastContext.isProcessing;
  const canChangeTheme = toReplace && replaceWith;
  const themesMatch =
    !toReplace || !replaceWith || doThemesMatch(toReplace, replaceWith);

  return (
    <>
      <ThemeSelector
        label="Swap references of"
        themes={penpotContext.allThemes}
        disabled={isDisabled}
        currentTheme={toReplace}
        allowNewTheme={false}
        useColorAsIcon={true}
        onThemeChanged={updateToReplaceWith}
      />

      <ThemeSelector
        label="with references from"
        themes={replaceWithThemes}
        disabled={isDisabled}
        currentTheme={replaceWith}
        allowNewTheme={false}
        useColorAsIcon={true}
        onThemeChanged={setReplaceWith}
      />

      <div className="action-buttons">
        <button
          type="button"
          data-appearance="primary"
          className="action-button"
          disabled={isDisabled || !canChangeTheme}
          onClick={onChangeClicked}
        >
          {currentSelection.length > 0
            ? "Swap themes in selection"
            : "Swap themes in page"}
        </button>
      </div>

      {themesMatch ? undefined : (
        <span className="body-s error-text">
          Some references may not be replaced because the themes do not match.
        </span>
      )}
    </>
  );
};

export { ChangeThemeForm };
