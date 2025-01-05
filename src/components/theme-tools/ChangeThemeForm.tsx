import { FC, useContext, useState } from "react";
import { PenpotContext } from "../penpot/PenpotContext.ts";
import { PluginTheme } from "../../model/material.ts";
import { ThemeSelector } from "../theme-selector/ThemeSelector.tsx";
import { doThemesMatch } from "../../utils/color-utils.ts";
import {
  MessageThemeToolsService,
  ThemeToolsService,
} from "../../services/ThemeToolsService.ts";

const ChangeThemeForm: FC = () => {
  const penpotContext = useContext(PenpotContext);
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

  const toolService: ThemeToolsService = new MessageThemeToolsService();
  const onChangeClicked = () => {
    if (!toReplace || !replaceWith) return;

    void toolService.replaceThemes(
      currentSelection.length > 0,
      toReplace,
      replaceWith,
    );
  };

  // TODO Implement isLoading
  const isLoading = false;
  const canChangeTheme = toReplace && replaceWith;
  const themesMatch =
    !toReplace || !replaceWith || doThemesMatch(toReplace, replaceWith);

  return (
    <>
      <ThemeSelector
        label="Swap references of"
        themes={penpotContext.allThemes}
        disabled={isLoading}
        currentTheme={toReplace}
        allowNewTheme={false}
        useColorAsIcon={true}
        onThemeChanged={updateToReplaceWith}
      />

      <ThemeSelector
        label="with references from"
        themes={replaceWithThemes}
        disabled={isLoading}
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
          disabled={isLoading || !canChangeTheme}
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
