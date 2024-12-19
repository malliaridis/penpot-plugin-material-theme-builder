import {
  argbFromHex,
  hexFromArgb,
  Theme,
  themeFromSourceColor,
  TonalPalette,
} from "@material/material-color-utilities";
import {JsonScheme, Palettes, Schemes, stateOpacities, toneValues} from "./model.ts";

export function createThemeColors(themeName: string, sourceColor: string) {
  const theme: Theme = themeFromSourceColor(argbFromHex(sourceColor));

  // Create source color
  const argbColor = theme.source;
  const color = penpot.library.local.createColor();
  color.color = hexFromArgb(argbColor);
  color.path = themeName;
  color.name = "source";

  // Create scheme color entries
  for (const scheme in theme.schemes) {
    const jsonScheme: JsonScheme =
      theme.schemes[scheme as keyof Schemes].toJSON();
    createColorScheme(themeName, scheme, jsonScheme);
  }

  // Create palette color entries
  for (const palette in theme.palettes) {
    const tonalPalette: TonalPalette =
      theme.palettes[palette as keyof Palettes];
    createColorPalette(themeName, palette, tonalPalette);
  }

  // TODO Add support for theme.customColors
}

function createColorScheme(
  themeName: string,
  name: string,
  jsonScheme: JsonScheme,
  withStateLayers: Boolean = true,
) {
  for (const colorName in jsonScheme) {
    const argbColor = jsonScheme[colorName];
    const color = penpot.library.local.createColor();
    color.color = hexFromArgb(argbColor);
    color.path = `${themeName}/scheme/${name}`;
    color.name = colorName;

    if (withStateLayers) createStateLayerColors(themeName, name, colorName, color.color);
  }
}

function createColorPalette(
  themeName: string,
  name: string,
  palette: TonalPalette,
) {
  toneValues.forEach((tone) => {
    const argbColor = palette.tone(tone);
    const color = penpot.library.local.createColor();
    color.color = hexFromArgb(argbColor);
    color.path = `${themeName}/palettes`;
    color.name = `${name}-${tone.toString()}`;
  });
}

function createStateLayerColors(
  themeName: string,
  name: string,
  colorName: string,
  color: string,
) {
  stateOpacities.forEach((opacity) => {
    const stateColor = penpot.library.local.createColor();
    stateColor.color = color;
    stateColor.opacity = opacity;
    stateColor.path = `${themeName}/state-layers/${name}/${colorName}`;
    stateColor.name = `opacity-${opacity.toFixed(2).toString()}`
  });
}
