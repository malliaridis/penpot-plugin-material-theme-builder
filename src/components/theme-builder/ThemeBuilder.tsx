import "./ThemeBuilder.css";
import { FC, useContext, useRef, useState } from "react";
import { PenpotContext } from "../penpot/PenpotContext.ts";
import ColorPicker, { ColorPickerRef } from "../color-picker/ColorPicker.tsx";
import { PluginTheme } from "../../model/material.ts";
import {
  ThemeBuilderService,
  MessageThemeBuilderService,
} from "../../services/ThemeBuilderService.ts";
import { ThemeSelector } from "../theme-selector/ThemeSelector.tsx";
import { Trash } from "react-feather";
import { ToastContext } from "../toast-loader/ToastContext.ts";

const ThemeBuilder: FC = () => {
  const penpotContext = useContext(PenpotContext);
  const toastContext = useContext(ToastContext);
  const colorPickerRef = useRef<ColorPickerRef>(null);
  const [currentTheme, setCurrentTheme] = useState<PluginTheme | undefined>(
    undefined,
  );
  const [themeName, setThemeName] = useState<string>("");
  const [generateTonalPalettes, setGenerateTonalPalettes] =
    useState<boolean>(false);

  const [generateStateLayers, setGenerateStateLayers] =
    useState<boolean>(false);

  const isDisabled = toastContext.isProcessing;

  const materialService: ThemeBuilderService = new MessageThemeBuilderService(
    toastContext.update,
  );

  const onGenerateClicked = () => {
    const theme = themeName != "" ? themeName : "material-theme";
    const color = colorPickerRef.current?.getColor();
    if (!color) {
      console.error("No color source found.");
      return;
    }

    // TODO Display notification bar here
    materialService
      .generateTheme(theme, color, generateTonalPalettes, generateStateLayers)
      .then((theme) => {
        const themes = penpotContext.themes;
        themes.push(theme);
        penpotContext.setThemes(themes);
        onThemeChanged(theme);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) console.error(err.message);
        // TODO Dismiss toast loader after some time of displaying the error
      });
  };

  const onUpdateClicked = () => {
    if (!currentTheme) return;

    const newName =
      themeName != "" && themeName != currentTheme.name ? themeName : undefined;
    const color = colorPickerRef.current?.getColor();
    const newColor = color != currentTheme.source.color ? color : undefined;
    // TODO Display notification bar here
    materialService
      .updateTheme(
        currentTheme,
        newName,
        newColor,
        generateTonalPalettes,
        generateStateLayers,
      )
      .then((theme) => {
        const updatedThemes = penpotContext.themes;
        const index = updatedThemes.indexOf(currentTheme);
        updatedThemes[index] = theme;
        penpotContext.setThemes(updatedThemes);
        onThemeChanged(theme);
      })
      .catch((err: unknown) => {
        console.error(err);
      });
  };

  const onResetChanges = () => {
    setThemeName("");

    if (!currentTheme?.source.color) return;
    colorPickerRef.current?.setColor(currentTheme.source.color);
    setGenerateTonalPalettes(currentTheme.palettes.length > 0);
    setGenerateStateLayers(Object.keys(currentTheme.stateLayers).length > 0);
  };

  const onDeleteTheme = () => {
    if (!currentTheme) return;
    // TODO Add confirmation dialog before deleting where user is notified
    //  to update any references before deleting
    void materialService.deleteTheme(currentTheme.name);
  };

  const onThemeChanged = (theme: PluginTheme | undefined) => {
    if (!theme) {
      setCurrentTheme(undefined);
      setGenerateTonalPalettes(false);
      setGenerateStateLayers(false);
      return;
    }

    setCurrentTheme(theme);
    setThemeName("");

    const color = theme.source.color;
    if (!color) return;
    colorPickerRef.current?.setColor(color);
    setGenerateTonalPalettes(theme.palettes.length > 0);
    setGenerateStateLayers(Object.keys(theme.stateLayers).length > 0);
  };

  return (
    <div className="content">
      <p className="body-m">
        Material theme builder that allows you to generate assets based on
        Material 3.
      </p>
      <div className="column-16">
        <ThemeSelector
          label="Theme"
          themes={penpotContext.themes}
          disabled={isDisabled}
          currentTheme={currentTheme}
          allowNewTheme={true}
          useColorAsIcon={false}
          onThemeChanged={onThemeChanged}
        />
        <div className="form-group">
          <label className="input-label body-m" htmlFor="input-theme-name">
            Theme Name
          </label>
          <input
            className="input"
            type="text"
            placeholder={currentTheme ? currentTheme.name : "material-theme"}
            id="input-theme-name"
            value={themeName}
            disabled={isDisabled}
            onChange={(e) => {
              setThemeName(e.target.value);
            }}
          />
        </div>
        <ColorPicker
          ref={colorPickerRef}
          disabled={isDisabled}
          color={currentTheme?.source.color}
        />

        <div>
          <span className="body-m">Additional Options</span>
          <div className="checkbox-container" aria-disabled={isDisabled}>
            <input
              className="checkbox-input"
              type="checkbox"
              id="generate-color-palettes"
              checked={generateTonalPalettes}
              onChange={(e) => {
                setGenerateTonalPalettes(e.target.checked);
              }}
              disabled={
                isDisabled || (currentTheme && currentTheme.palettes.length > 0)
              }
            />
            <label htmlFor="generate-color-palettes" className="checkbox">
              {currentTheme && currentTheme.palettes.length > 0
                ? "Update color palettes"
                : "Generate color palettes"}
            </label>
          </div>
          <div className="checkbox-container" aria-disabled={isDisabled}>
            <input
              className="checkbox-input"
              type="checkbox"
              id="generate-state-layers"
              checked={generateStateLayers}
              onChange={(e) => {
                setGenerateStateLayers(e.target.checked);
              }}
              disabled={
                isDisabled ||
                (currentTheme &&
                  Object.keys(currentTheme.stateLayers).length > 0)
              }
            />
            <label htmlFor="generate-state-layers" className="checkbox">
              {currentTheme && Object.keys(currentTheme.stateLayers).length > 0
                ? "Update state layers"
                : "Generate state layers assets"}
            </label>
          </div>
        </div>

        <div className="action-buttons">
          <button
            type="button"
            data-appearance="primary"
            className="action-button"
            disabled={isDisabled}
            onClick={currentTheme ? onUpdateClicked : onGenerateClicked}
          >
            {currentTheme ? "Update theme" : "Generate Theme"}
          </button>
          {currentTheme && (
            <div className="action-button-row">
              <button
                type="button"
                data-appearance="secondary"
                className="action-button"
                onClick={onResetChanges}
                disabled={isDisabled}
              >
                Reset changes
              </button>
              <button
                type="button"
                data-appearance="primary"
                data-variant="destructive"
                className="action-button-small"
                onClick={onDeleteTheme}
                // Not supported by penpot API yet
                disabled={true}
              >
                <Trash />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ThemeBuilder };
