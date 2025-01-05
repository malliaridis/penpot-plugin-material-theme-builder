import "./ConfigureThemeForm.css";
import { FC, useContext, useState } from "react";
import { ThemeSelector } from "../theme-selector/ThemeSelector.tsx";
import { PenpotContext } from "../penpot/PenpotContext.ts";
import { PluginTheme } from "../../model/material.ts";
import {
  MessageThemeToolsService,
  ThemeToolsService,
} from "../../services/ThemeToolsService.ts";
import { ToastContext } from "../toast-loader/ToastContext.ts";

const ConfigureThemeForm: FC = () => {
  const penpotContext = useContext(PenpotContext);
  const toastContext = useContext(ToastContext);
  const currentSelection = penpotContext.currentSelection;
  const firstTheme = penpotContext.allThemes[0];
  const [currentTheme, onThemeChanged] = useState<PluginTheme | undefined>(
    firstTheme,
  );
  const [useDarkTheme, setUseDarkTheme] = useState(false);

  const toolService: ThemeToolsService = new MessageThemeToolsService(
    toastContext.update,
  );
  const isDisabled = toastContext.isProcessing;

  const onUpdateClicked = () => {
    if (!currentTheme) return;

    void toolService.swapColors(
      currentSelection.length > 0,
      currentTheme,
      useDarkTheme,
    );
  };

  return (
    <div className="column-16">
      <ThemeSelector
        label="Theme"
        themes={penpotContext.allThemes}
        disabled={isDisabled}
        currentTheme={currentTheme}
        allowNewTheme={false}
        useColorAsIcon={true}
        onThemeChanged={onThemeChanged}
      />
      <div className="form-group">
        <div className="radio-group">
          <div className="radio-container">
            <input
              type="radio"
              className="radio-input"
              id="light-theme-radio-input"
              name="Light"
              value="light"
              checked={!useDarkTheme}
              onChange={() => {
                setUseDarkTheme(false);
              }}
            />
            <label className="radio-label" htmlFor="light-theme-radio-input">
              Light Mode
            </label>
          </div>
          <div className="radio-container">
            <input
              type="radio"
              className="radio-input"
              id="dark-theme-radio-input"
              name="Dark"
              value="dark"
              checked={useDarkTheme}
              onChange={() => {
                setUseDarkTheme(true);
              }}
            />
            <label className="radio-label" htmlFor="dark-theme-radio-input">
              Dark Mode
            </label>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button
          type="button"
          data-appearance="primary"
          className="action-button"
          disabled={isDisabled}
          onClick={onUpdateClicked}
        >
          {currentSelection.length > 0 ? "Update Selection" : "Update Page"}
        </button>
      </div>
    </div>
  );
};

export { ConfigureThemeForm };
