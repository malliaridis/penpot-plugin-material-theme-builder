import "./ThemeBuilder.css";
import { useContext, useRef, useState } from "react";
import { PenpotContext } from "../penpot/PenpotContext.ts";
import ColorPicker, { ColorPickerRef } from "../color-picker/ColorPicker.tsx";
import { PluginTheme } from "../../model/material.ts";
import {
  ThemeBuilderService,
  MessageThemeBuilderService,
} from "../../services/ThemeBuilderService.ts";
import { ThemeSelector } from "../theme-selector/ThemeSelector.tsx";
import { Trash } from "react-feather";
import { ToastLoader } from "../toast-loader/ToastLoader.tsx";

const ThemeBuilder: React.FC = () => {
  const penpotContext = useContext(PenpotContext);
  const colorPickerRef = useRef<ColorPickerRef>(null);
  const [currentTheme, setCurrentTheme] = useState<PluginTheme | undefined>(
    undefined,
  );
  const [themeName, setThemeName] = useState<string>("");
  const [generateTonalPalettes, setGenerateTonalPalettes] =
    useState<boolean>(false);

  const [generateStateLayers, setGenerateStateLayers] =
    useState<boolean>(false);

  const [progress, setProgress] = useState<number[] | undefined>(undefined);
  const isLoading = progress != undefined;

  const materialService: ThemeBuilderService = new MessageThemeBuilderService();

  const onProgress = (currentProgress: number, total: number) => {
    if (currentProgress != total) setProgress([currentProgress, total]);
    else setProgress(undefined);
  };

  const onGenerateClicked = () => {
    const theme = themeName != "" ? themeName : "material-theme";
    const color = colorPickerRef.current?.getColor();
    if (!color) {
      console.error("No color source found.");
      return;
    }

    // TODO Display notification bar here
    materialService
      .generateTheme(
        theme,
        color,
        generateTonalPalettes,
        generateStateLayers,
        onProgress,
      )
      .then((theme) => {
        const themes = penpotContext.themes;
        themes.push(theme);
        penpotContext.setThemes(themes);
        onThemeChanged(theme);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) console.error(err.message);
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
        onProgress,
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
          disabled={isLoading}
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
            disabled={isLoading}
            onChange={(e) => {
              setThemeName(e.target.value);
            }}
          />
        </div>
        <ColorPicker
          ref={colorPickerRef}
          disabled={isLoading}
          color={currentTheme?.source.color}
        />

        <div>
          <span className="body-m">Additional Options</span>
          <div className="checkbox-container" aria-disabled={isLoading}>
            <input
              className="checkbox-input"
              type="checkbox"
              id="generate-color-palettes"
              checked={generateTonalPalettes}
              onChange={(e) => {
                setGenerateTonalPalettes(e.target.checked);
              }}
              disabled={
                isLoading || (currentTheme && currentTheme.palettes.length > 0)
              }
            />
            <label htmlFor="generate-color-palettes" className="checkbox">
              {currentTheme && currentTheme.palettes.length > 0
                ? "Update color palettes"
                : "Generate color palettes"}
            </label>
          </div>
          <div className="checkbox-container" aria-disabled={isLoading}>
            <input
              className="checkbox-input"
              type="checkbox"
              id="generate-state-layers"
              checked={generateStateLayers}
              onChange={(e) => {
                setGenerateStateLayers(e.target.checked);
              }}
              disabled={
                isLoading ||
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
            disabled={isLoading}
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
                disabled={isLoading}
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
      {isLoading && (
        <ToastLoader progress={progress[0] / progress[1]}>
          <span className="body-m primary">
            {currentTheme
              ? "Updating theme assets..."
              : "Generating theme assets..."}
          </span>
          <span className="body-m secondary">
            {progress[0].toString()}/{progress[1].toString()}
          </span>
        </ToastLoader>
      )}
    </div>
  );
};

export { ThemeBuilder };
