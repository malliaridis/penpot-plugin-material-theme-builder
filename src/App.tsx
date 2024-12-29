import "./App.css";
import ColorPicker, {
  ColorPickerRef,
} from "./components/color-picker/ColorPicker.tsx";
import { useContext, useRef, useState } from "react";
import { MessageMaterialThemeService } from "./services/MaterialThemeService.ts";
import Footer from "./components/footer/Footer.tsx";
import { ThemeSelector } from "./components/theme-selector/ThemeSelector.tsx";
import { PenpotContext } from "./components/penpot/PenpotContext.ts";
import { PluginTheme } from "./model/material.ts";
import { Trash } from "react-feather";

function App() {
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

  const materialService = new MessageMaterialThemeService();

  const onProgress = (progress: number, total: number) => {
    // TODO Implement notification with progress bar
    console.log(`${progress.toString()}/${total.toString()}`);
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
        onThemeChanged(theme.name);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) console.error(err.message);
      });
  };

  const onUpdateClicked = () => {
    if (!currentTheme) return;

    const newName = themeName != "" ? themeName : undefined;
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
        onThemeChanged(theme.name);
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

  const onThemeChanged = (themeName: string | undefined) => {
    if (!themeName) {
      setCurrentTheme(undefined);
      setGenerateTonalPalettes(false);
      setGenerateStateLayers(false);
      return;
    }

    const theme = penpotContext.themes.find(
      (theme) => theme.name === themeName,
    );
    if (!theme) return;
    setCurrentTheme(theme);
    setThemeName("");

    const color = theme.source.color;
    if (!color) return;
    colorPickerRef.current?.setColor(color);
    setGenerateTonalPalettes(theme.palettes.length > 0);
    setGenerateStateLayers(Object.keys(theme.stateLayers).length > 0);
  };

  return (
    <div className="container">
      <div className="content">
        <p className="body-m">
          Material theme builder that allows you to generate assets based on
          Material 3.
        </p>
        <div className="column-16">
          <ThemeSelector
            themes={penpotContext.themes}
            currentTheme={currentTheme?.name}
            allowNewTheme={true}
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
              onChange={(e) => {
                setThemeName(e.target.value);
              }}
            />
          </div>
          <ColorPicker
            ref={colorPickerRef}
            color={currentTheme?.source.color}
          />

          <div>
            <span className="body-m">Additional Options</span>
            <div className="checkbox-container">
              <input
                className="checkbox-input"
                type="checkbox"
                id="generate-color-palettes"
                checked={generateTonalPalettes}
                onChange={(e) => {
                  setGenerateTonalPalettes(e.target.checked);
                }}
                disabled={currentTheme && currentTheme.palettes.length > 0}
              />
              <label htmlFor="generate-color-palettes" className="checkbox">
                {currentTheme && currentTheme.palettes.length > 0
                  ? "Update color palettes"
                  : "Generate color palettes"}
              </label>
            </div>
            <div className="checkbox-container">
              <input
                className="checkbox-input"
                type="checkbox"
                id="generate-state-layers"
                checked={generateStateLayers}
                onChange={(e) => {
                  setGenerateStateLayers(e.target.checked);
                }}
                disabled={
                  currentTheme &&
                  Object.keys(currentTheme.stateLayers).length > 0
                }
              />
              <label htmlFor="generate-state-layers" className="checkbox">
                {currentTheme &&
                Object.keys(currentTheme.stateLayers).length > 0
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
      <Footer />
    </div>
  );
}

export default App;
