import {Scheme, TonalPalette} from "@material/material-color-utilities";

export type Schemes = {
    light: Scheme;
    dark: Scheme;
}

export type Palettes = {
    primary: TonalPalette;
    secondary: TonalPalette;
    tertiary: TonalPalette;
    neutral: TonalPalette;
    neutralVariant: TonalPalette;
    error: TonalPalette;
}

export type JsonScheme = { [key: string]: number }

export const toneValues = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100]
