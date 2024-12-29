import { Scheme, TonalPalette } from "@material/material-color-utilities";
import { LibraryColor } from "@penpot/plugin-types";

interface PluginTheme {
  name: string;
  source: LibraryColor;
  scheme: Record<string, LibraryColor[] | undefined>;
  stateLayers: Record<string, LibraryColor[] | undefined>;
  palettes: LibraryColor[];
  // TODO Add unsupported colors that use the theme as prefix
}

interface Schemes {
  light: Scheme;
  dark: Scheme;
}

interface Palettes {
  primary: TonalPalette;
  secondary: TonalPalette;
  tertiary: TonalPalette;
  neutral: TonalPalette;
  neutralVariant: TonalPalette;
  error: TonalPalette;
}

type JsonScheme = Record<string, number>;

const toneValues = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100];

/**
 * State layer opacities according to "State layer tokens & values" from Material 3.
 *
 * @see https://m3.material.io/foundations/interaction/states/state-layers
 */
const stateOpacities = [0.08, 0.1, 0.16];

export { toneValues, stateOpacities };
export type { Schemes, Palettes, JsonScheme, PluginTheme };
