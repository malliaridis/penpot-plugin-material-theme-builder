import {
  argbFromHex,
  hexFromArgb,
  Theme,
  themeFromSourceColor,
  TonalPalette,
} from "@material/material-color-utilities";
import {
  JsonScheme,
  Palettes,
  Schemes,
  stateOpacities,
  toneValues,
} from "../model/material.ts";
import { argbWithOpacity } from "../utils/color-utils.ts";

interface MaterialThemeService {
  generateTheme(
    themeName: string,
    sourceColor: string,
    withTonalPalettes: boolean,
    withStateLayers: boolean,
    onProgress: (progress: number, total: number) => void,
  ): Promise<void>;
}

class MessageMaterialThemeService implements MaterialThemeService {
  async generateTheme(
    themeName: string,
    sourceColor: string,
    withTonalPalettes = false,
    withStateLayers = true,
    onProgress: (progress: number, total: number) => void,
  ) {
    const theme: Theme = themeFromSourceColor(argbFromHex(sourceColor));

    // Create source color
    const argbColor = theme.source;
    this.createLocalLibraryColor(hexFromArgb(argbColor), themeName, "source");

    // TODO Use correctly onProgress
    onProgress(1, 233);

    await new Promise((resolve: (value: boolean) => void) => {
      setTimeout(resolve, 10);
      // Create scheme color entries
      for (const scheme in theme.schemes) {
        const jsonScheme: JsonScheme =
          theme.schemes[scheme as keyof Schemes].toJSON();
        this.createColorScheme(themeName, scheme, jsonScheme, withStateLayers);
      }

      // Create palette color entries
      if (withTonalPalettes)
        this.createTonalPalettes(themeName, theme.palettes);

      resolve(true);
    });
    // TODO Add support for theme.customColors
  }

  private createColorScheme(
    themeName: string,
    name: string,
    jsonScheme: JsonScheme,
    withStateLayers = true,
  ) {
    for (const colorName in jsonScheme) {
      const argbColor = jsonScheme[colorName];
      this.createLocalLibraryColor(
        hexFromArgb(argbColor),
        `${themeName}/scheme/${name}`,
        colorName,
      );

      if (withStateLayers)
        this.createStateLayerColors(themeName, name, colorName, argbColor);
    }
  }

  private createStateLayerColors(
    themeName: string,
    name: string,
    colorName: string,
    argbColor: number,
  ) {
    stateOpacities.forEach((opacity) => {
      const color = hexFromArgb(argbWithOpacity(argbColor, opacity));
      this.createLocalLibraryColor(
        color,
        `${themeName}/state-layers/${name}/${colorName}`,
        `opacity-${opacity.toFixed(2).toString()}`,
      );
    });
  }

  private createTonalPalettes(themeName: string, palettes: Palettes) {
    for (const palette in palettes) {
      const tonalPalette: TonalPalette = palettes[palette as keyof Palettes];
      this.createColorPalette(themeName, palette, tonalPalette);
    }
  }

  private createColorPalette(
    themeName: string,
    name: string,
    palette: TonalPalette,
  ) {
    toneValues.forEach((tone) => {
      const argbColor = palette.tone(tone);
      this.createLocalLibraryColor(
        hexFromArgb(argbColor),
        `${themeName}/palettes`,
        `${name}-${tone.toString()}`,
      );
    });
  }

  private createLocalLibraryColor(color: string, group: string, name: string) {
    this.sendMessage("create-local-library-color", { color, group, name });
  }

  /**
   * Sends a well-defined message to plugin.ts
   *
   * @param key The message key
   * @param data Data to send
   */
  private sendMessage(key: string, data: object) {
    parent.postMessage({ type: key, data: data }, "*");
  }
}

export { MessageMaterialThemeService };
export type { MaterialThemeService };
