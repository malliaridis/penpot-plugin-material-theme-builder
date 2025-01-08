import { FC, useContext, useState } from "react";
import { PenpotContext } from "../penpot/PenpotContext.ts";
import { PluginTheme } from "../../model/material.ts";
import { ThemeSelector } from "../theme-selector/ThemeSelector.tsx";
import { ToastContext } from "../toast-loader/ToastContext.ts";
import {
  MessageThemeToolsService,
  ThemeToolsService,
} from "../../services/ThemeToolsService.ts";

const SwapValuesForm: FC = () => {
  const penpotContext = useContext(PenpotContext);
  const toastContext = useContext(ToastContext);
  // Only local themes should be set in themeFrom
  const [themeFrom, setThemeFrom] = useState<PluginTheme | undefined>();
  const [addNewColors, setAddNewColors] = useState(false);
  const [removeMissingColors, setRemoveMissingColors] = useState(false);

  // All themes are allowed in themeWith
  const [themeWith, setThemeWith] = useState<PluginTheme | undefined>();

  const themesWith = penpotContext.allThemes.filter((theme) => {
    // Filter out the themeFrom to prevent replacement
    // of values with the same theme
    return theme.name != themeFrom?.name;
  });

  const toolService: ThemeToolsService = new MessageThemeToolsService(
    toastContext.update,
  );

  const canUpdate = !!themeFrom && !!themeWith;

  const onUpdateTheme = () => {
    if (!canUpdate) return; // Should not be possible

    void toolService.updateTheme(
      themeFrom,
      themeWith,
      addNewColors,
      removeMissingColors,
    );
  };

  const isDisabled = toastContext.isProcessing;

  return (
    <div className="column-16">
      <ThemeSelector
        label="Replace theme values of"
        themes={penpotContext.themes} // use only local themes
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

      <div>
        <span className="body-m">Additional Options</span>
        <div className="checkbox-container" aria-disabled={isDisabled}>
          <input
            className="checkbox-input"
            type="checkbox"
            id="add-new-colors-checkbox"
            checked={addNewColors}
            onChange={(e) => {
              setAddNewColors(e.target.checked);
            }}
            disabled={isDisabled}
          />
          <label htmlFor="add-new-colors-checkbox" className="checkbox">
            Add missing assets
          </label>
        </div>
        <div className="checkbox-container" aria-disabled={isDisabled}>
          <input
            className="checkbox-input"
            type="checkbox"
            id="remove-missing-colors-checkbox"
            checked={removeMissingColors}
            onChange={(e) => {
              setRemoveMissingColors(e.target.checked);
            }}
            disabled={isDisabled}
          />
          <label htmlFor="remove-missing-colors-checkbox" className="checkbox">
            Remove extra assets
          </label>
        </div>
      </div>

      <div className="action-buttons">
        <button
          type="button"
          data-appearance="primary"
          className="action-button"
          disabled={isDisabled || !canUpdate}
          onClick={onUpdateTheme}
        >
          {canUpdate ? `Update ${themeFrom.name}` : "Select themes to start"}
        </button>
      </div>
    </div>
  );
};

export { SwapValuesForm };
