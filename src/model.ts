import { Scheme, TonalPalette } from "@material/material-color-utilities";

export interface Schemes {
  light: Scheme;
  dark: Scheme;
}

export interface Palettes {
  primary: TonalPalette;
  secondary: TonalPalette;
  tertiary: TonalPalette;
  neutral: TonalPalette;
  neutralVariant: TonalPalette;
  error: TonalPalette;
}

export type JsonScheme = Record<string, number>;

export const toneValues = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100];

export interface MessageData {
  source: string;
}

export interface PenpotData extends MessageData {
  source: "penpot";
  theme: "string";
}
