import { Fill, LibraryColor } from "@penpot/plugin-types";
import {
  JsonScheme,
  Palettes,
  PluginTheme,
  Schemes,
} from "../model/material.ts";
import { Theme } from "@material/material-color-utilities";

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

function getValidSourceColor(
  raw: string | undefined | null,
): string | undefined {
  if (!raw) return undefined;

  let colorRaw = raw;
  if (colorRaw.startsWith("#")) {
    colorRaw = colorRaw.substring(1);
  }
  if (colorRaw.length == 1) {
    colorRaw = colorRaw.repeat(6);
  }
  if (colorRaw.length == 2) {
    colorRaw = colorRaw.repeat(3);
  }
  if (colorRaw.length == 3) {
    colorRaw = colorRaw.repeat(2);
  }
  colorRaw = `#${colorRaw}`;

  if (hexColorRegex.test(colorRaw)) return colorRaw;
  else return undefined;
}

// Function to combine ARGB components into a single integer
function argbWithOpacity(argb: number, opacity: number): number {
  if (opacity < 0 || opacity > 1) {
    throw new Error("Opacity must be a value between 0 and 1");
  }
  // Extract the alpha channel (most significant 8 bits)
  const originalAlpha = (argb >> 24) & 0xff;

  // Scale the alpha by the opacity value
  const newAlpha = Math.round(originalAlpha * opacity);

  // Combine and return the new alpha with the original RGB values
  return (newAlpha << 24) | (argb & 0x00ffffff);
}

function mapColorsToThemes(colors: LibraryColor[]): PluginTheme[] {
  const themes: PluginTheme[] = colors
    .filter((color) => {
      // This is the simplest form of identifying plugin-generated themes.
      // Look for library colors that are in the format of "[theme-name] / source"
      return (
        color.path.length > 0 &&
        !color.path.includes("/") &&
        color.name == "source"
      );
    })
    .map((color) => {
      return {
        name: color.path,
        source: color,
        scheme: {},
        stateLayers: {},
        palettes: [],
      };
    });

  themes.forEach((theme) => {
    const themePrefix = theme.name + " / ";

    colors
      .filter((color) => {
        return color.path.startsWith(themePrefix);
      })
      .forEach((themeColor) => {
        const subPath = themeColor.path.substring(themePrefix.length);
        addIfSchemeColor(theme, subPath, themeColor);
        addIfStateLayerColor(theme, subPath, themeColor);
        addIfPaletteColor(theme, subPath, themeColor);
      });
  });

  return themes;
}

function addIfSchemeColor(
  theme: PluginTheme,
  subPath: string,
  color: LibraryColor,
) {
  if (subPath.startsWith("scheme / ")) {
    const variant = subPath.split(" / ")[1];
    if (theme.scheme[variant]) {
      theme.scheme[variant].push(color);
    } else {
      theme.scheme[variant] = [color];
    }
  }
}

function addIfStateLayerColor(
  theme: PluginTheme,
  subPath: string,
  color: LibraryColor,
) {
  if (subPath.startsWith("state-layers / ")) {
    const variant = subPath.split(" / ")[1];
    if (theme.stateLayers[variant]) {
      theme.stateLayers[variant].push(color);
    } else {
      theme.stateLayers[variant] = [color];
    }
  }
}

function addIfPaletteColor(
  theme: PluginTheme,
  subPath: string,
  color: LibraryColor,
) {
  if (subPath.startsWith("palettes")) {
    theme.palettes.push(color);
  }
}

function flattenColors(
  pluginTheme: PluginTheme,
  excludeRootLevelColors: boolean,
): LibraryColor[] {
  const colors: LibraryColor[] = [];

  if (!excludeRootLevelColors) colors.push(pluginTheme.source);

  // Add scheme colors
  for (const scheme in pluginTheme.scheme) {
    const schemeColors = pluginTheme.scheme[scheme] ?? [];
    colors.push(...schemeColors);
  }

  // Add state-layer colors
  for (const scheme in pluginTheme.stateLayers) {
    const schemeColors = pluginTheme.stateLayers[scheme] ?? [];
    colors.push(...schemeColors);
  }

  // Add palettes
  colors.push(...pluginTheme.palettes);

  return colors;
}

function getColorForPathSegments(
  theme: Theme,
  segments: string[],
  name: string,
): number | undefined {
  if (segments.length == 1) {
    if (name == "source") return theme.source;
  }

  switch (segments[1]) {
    case "scheme": {
      const scheme: JsonScheme =
        theme.schemes[segments[2] as keyof Schemes].toJSON();
      return scheme[name];
    }
    case "state-layers": {
      const scheme: JsonScheme =
        theme.schemes[segments[2] as keyof Schemes].toJSON();
      const color = scheme[segments[3]];
      const opacity = Number(name.split("-"));
      return argbWithOpacity(color, opacity);
    }
    case "palettes": {
      const elements = name.split("-");
      const color = elements[0];
      const tone = elements[1];

      return theme.palettes[color as keyof Palettes].tone(Number(tone));
    }
  }
  return undefined;
}

/**
 * Returns the total colors of a plugin theme.
 *
 * @param withStateLayers Whether the theme should include state layers
 * @param withTonalPalettes Whether the theme should include tonal palettes.
 */
function getExpectedColorsCount(
  withStateLayers: boolean,
  withTonalPalettes: boolean,
) {
  let expectedColorCount = 59;
  if (withStateLayers) {
    expectedColorCount += 174;
  }
  if (withTonalPalettes) {
    expectedColorCount += 72;
  }
  return expectedColorCount;
}

/**
 * Sorts colors alphabetically.
 *
 * @param colors Color array to sort.
 * @return The {@link colors} array sorted alphabetically.
 */
function sortedColors(colors: LibraryColor[]): LibraryColor[] {
  return colors.sort(colorCompare);
}

/**
 * Color compare function that can be used to sort colors alphabetically.
 *
 * @param color1 First color.
 * @param color2 Second color.
 */
function colorCompare(color1: LibraryColor, color2: LibraryColor): number {
  return (color1.path + color1.name).localeCompare(color2.path + color2.name);
}

/**
 * Determines whether a value is a {@link Fill} array.
 *
 * @param value the value to check
 * @return `true` iff the value is a Fill array
 */
function isFillArray(value: Fill[] | "mixed"): value is Fill[] {
  return Array.isArray(value);
}

export {
  getValidSourceColor,
  argbWithOpacity,
  mapColorsToThemes,
  flattenColors,
  getColorForPathSegments,
  getExpectedColorsCount,
  sortedColors,
  colorCompare,
  isFillArray,
};
