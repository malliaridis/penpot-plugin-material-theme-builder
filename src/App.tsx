import "./App.css";
import ColorPicker, {
  ColorPickerRef,
} from "./components/color-picker/ColorPicker.tsx";
import { useRef, useState } from "react";
import { MessageMaterialThemeService } from "./services/MaterialThemeService.ts";

function App() {
  const colorPickerRef = useRef<ColorPickerRef>(null);
  const [themeName, setThemeName] = useState<string>("");

  const materialService = new MessageMaterialThemeService();

  const onProgress = (progress: number, total: number) => {
    // TODO Implement notification with progress bar
    console.log(`${progress.toString()}/${total.toString()}`);
  };

  const onGenerate = () => {
    const theme = themeName != "" ? themeName : "material-theme";
    const color = colorPickerRef.current?.getColor();
    if (!color) {
      console.error("No color source found.");
      return;
    }

    // TODO Retrieve tonal palettes value from checkbox
    const withTonalPalettes = false;
    const withStateLayers = true;

    materialService
      .generateTheme(
        theme,
        color,
        withTonalPalettes,
        withStateLayers,
        onProgress,
      )
      .then(() => {
        console.log("Theme generated");
      })
      .catch((err: unknown) => {
        if (err instanceof Error) console.error(err.message);
      });
  };

  return (
    <>
      <p className="body-m">
        Material theme builder that allows you to generate assets based on
        Material 3.
      </p>
      <div className="form-group">
        <label className="input-label body-m" htmlFor="input-theme-name">
          Theme Name
        </label>
        <input
          className="input"
          type="text"
          placeholder="material-theme"
          id="input-theme-name"
          value={themeName}
          onChange={(e) => {
            setThemeName(e.target.value);
          }}
        />
        <div style={{ height: "var(--spacing-16)" }}></div>
        <ColorPicker ref={colorPickerRef} />
      </div>

      <div style={{ height: "var(--spacing-24)" }}></div>

      <button
        type="button"
        data-appearance="primary"
        className="full-width-button"
        onClick={onGenerate}
      >
        Generate Theme
      </button>
    </>
  );
}

export default App;
