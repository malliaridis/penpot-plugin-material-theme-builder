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
  PluginTheme,
  Schemes,
  stateOpacities,
  toneValues,
} from "../model/material.ts";
import {
  argbWithOpacity,
  flattenColors,
  getColorForPathSegments,
  getExpectedColorsCount,
  mapColorsToThemes,
} from "../utils/color-utils.ts";
import {
  ColorData,
  DeleteLocalLibraryThemeData,
  Message,
  MessageData,
} from "../model/message.ts";
import { ToastData } from "../model/ToastData.ts";
import { LibraryColor } from "@penpot/plugin-types";
import { MessageService } from "./MessageService.ts";

interface ThemeBuilderService {
  /**
   * Generates a theme with a given name, source color and options.
   *
   * @param themeName Theme name to use.
   * @param sourceColor Source color to use.
   * @param withTonalPalettes Whether to generate tonal palette colors.
   * @param withStateLayers Whether to generate state layer colors.
   */
  generateTheme(
    themeName: string,
    sourceColor: string,
    withTonalPalettes: boolean,
    withStateLayers: boolean,
  ): Promise<PluginTheme>;

  /**
   * Updates an existing theme with the new attributes.
   *
   * @param theme The existing theme to update.
   * @param themeName new theme name or undefined if it should not be renamed.
   * @param sourceColor New source color to use, or undefined if the colors
   * should not be updated.
   * @param withTonalPalettes Whether tonal palette colors should be generated
   * if not present.
   * @param withStateLayers Whether state layer colors should be generated if
   * not present.
   */
  updateTheme(
    theme: PluginTheme,
    themeName: string | undefined,
    sourceColor: string | undefined,
    withTonalPalettes: boolean,
    withStateLayers: boolean,
  ): Promise<PluginTheme>;

  /**
   * Deletes a theme by name.
   *
   * @param deleteTheme Name of the theme to delete.
   */
  deleteTheme(deleteTheme: string): Promise<void>;
}

/**
 * The default implementation of {@link ThemeBuilderService} that is based on
 * window messages.
 *
 * Since penpot can be used only from plugin.ts, messages are sent received
 * from this service. The messages sent are consumed by penpot.ts, which
 * generates new messages for successful actions. This service then consumes
 * messages sent by penpot.ts for each action to update the state.
 */
class MessageThemeBuilderService
  extends MessageService
  implements ThemeBuilderService
{
  async generateTheme(
    themeName: string,
    sourceColor: string,
    withTonalPalettes = false,
    withStateLayers = true,
  ): Promise<PluginTheme> {
    // Create a reference for identifying any color created event
    const ref = Math.random();

    const expectedColorCount = getExpectedColorsCount(
      withStateLayers,
      withTonalPalettes,
    );
    let count = 0;
    const theme: Theme = themeFromSourceColor(argbFromHex(sourceColor));
    const colors: LibraryColor[] = [];

    this.onUpdate({
      type: "progress-started",
      message: "Generating theme...",
      ref,
    } as ToastData);

    return await new Promise(
      (
        resolve: (value: PluginTheme) => void,
        reject: (reason: Error) => void,
      ) => {
        const listener = (event: MessageEvent<Message<MessageData>>) => {
          if (
            event.data.source != "penpot" ||
            event.data.type != "color-created"
          ) {
            return;
          }

          const data = event.data.data as ColorData;

          if (data.ref != ref) return;

          colors.push(data.color);
          this.onUpdate({
            type: "progress-updated",
            message: "Generating theme assets...",
            loaded: ++count,
            total: expectedColorCount,
            ref,
          } as ToastData);

          if (colors.length == expectedColorCount) {
            this.onUpdate({
              type: "progress-updated",
              message: "Finalizing theme generation...",
              ref,
            } as ToastData);

            const pluginTheme = mapColorsToThemes(colors);
            if (pluginTheme.length != 1) {
              reject(
                new Error(
                  `Expected exactly one theme to be generated, but got ${pluginTheme.length.toString()}`,
                ),
              );
            }

            this.onUpdate({
              type: "progress-completed",
              message: "Theme generated.",
              ref,
            } as ToastData);

            window.removeEventListener("message", listener);
            resolve(pluginTheme[0]);
          }
        };

        window.addEventListener("message", listener);

        // Create source color
        const argbColor = theme.source;
        this.createColor(
          {
            color: hexFromArgb(argbColor),
            path: themeName,
            name: "source",
          } as LibraryColor,
          ref,
        );

        // Create scheme color entries
        for (const scheme in theme.schemes) {
          const jsonScheme: JsonScheme =
            theme.schemes[scheme as keyof Schemes].toJSON();
          this.createColorScheme(themeName, scheme, jsonScheme, ref);

          if (withStateLayers)
            this.createStateLayerColors(themeName, scheme, jsonScheme, ref);
        }

        // Create palette color entries
        if (withTonalPalettes)
          this.createTonalPalettes(themeName, theme.palettes, ref);
      },
    );
    // TODO Add support for theme.customColors
  }

  async updateTheme(
    pluginTheme: PluginTheme,
    themeName: string | undefined,
    sourceColor: string | undefined,
    withTonalPalettes: boolean,
    withStateLayers: boolean,
  ): Promise<PluginTheme> {
    // Create a reference for identifying any operation-related event
    const ref = Math.random();
    let count = 0;

    this.onUpdate({
      type: "progress-started",
      message: "Preparing theme update...",
      ref,
    } as ToastData);

    // Generate a theme if there is a new source color
    const theme = sourceColor
      ? themeFromSourceColor(argbFromHex(sourceColor))
      : undefined;

    const colors = flattenColors(pluginTheme, false);

    const updates = colors.map((color) => {
      // Generate updates for all colors in the current pluginTheme

      const segments = color.path.split(" / ");

      if (theme) {
        const colorValue = getColorForPathSegments(theme, segments, color.name);
        if (colorValue) {
          color.color = hexFromArgb(colorValue);
        } else {
          console.warn("Unsupported color found: " + JSON.stringify(color));
        }
      }
      if (themeName) {
        segments[0] = themeName;
        color.path = segments.join("/");
      }

      return color;
    });

    const shouldGenerateStateLayers =
      withStateLayers && Object.keys(pluginTheme.stateLayers).length == 0;
    const shouldGenerateTonalPalettes =
      withTonalPalettes && pluginTheme.palettes.length == 0;

    let expectedColorCount = colors.length;
    if (shouldGenerateStateLayers) {
      expectedColorCount += 174;
    }
    if (shouldGenerateTonalPalettes) {
      expectedColorCount += 72;
    }
    const updatedColors: LibraryColor[] = [];

    console.log("Returning promise");
    // Prepare promise for the updated colors
    return await new Promise(
      (
        resolve: (value: PluginTheme) => void,
        reject: (reason: Error) => void,
      ) => {
        console.log("Creating event listener");
        const listener = (event: MessageEvent<Message<MessageData>>) => {
          console.log("listener called");
          if (
            event.data.source != "penpot" ||
            (event.data.type != "color-updated" &&
              event.data.type != "color-created")
          ) {
            return;
          }

          const data = event.data.data as ColorData;

          if (data.ref != ref) return;
          console.log("Notifying progress");
          updatedColors.push(data.color);
          this.onUpdate({
            type: "progress-updated",
            message: "Updating theme assets...",
            loaded: ++count,
            total: expectedColorCount,
            ref,
          } as ToastData);

          if (updatedColors.length < expectedColorCount) return;

          this.onUpdate({
            type: "progress-updated",
            message: "Finalizing theme update...",
            ref,
          } as ToastData);

          const pluginTheme = mapColorsToThemes(updatedColors);
          if (pluginTheme.length != 1) {
            reject(
              new Error(
                `Expected exactly one theme to be generated, but got ${pluginTheme.length.toString()}`,
              ),
            );
          }

          this.onUpdate({
            type: "progress-completed",
            message: "Theme updated successfully.",
            ref,
          } as ToastData);

          window.removeEventListener("message", listener);
          resolve(pluginTheme[0]);
        };
        console.log("adding event listener");
        window.addEventListener("message", listener);

        // Send updates to penpot
        updates.forEach((update) => {
          this.sendMessage("update-color", {
            color: update,
            ref,
          } as ColorData);
        });

        if (shouldGenerateTonalPalettes || shouldGenerateStateLayers) {
          let requiredTheme: Theme;
          if (theme) {
            requiredTheme = theme;
          } else if (pluginTheme.source.color) {
            requiredTheme = themeFromSourceColor(
              argbFromHex(pluginTheme.source.color),
            );
          } else {
            throw new Error(
              "No source color available to generate tonal palettes or state layers.",
            );
          }

          const requiredThemeName = themeName ?? pluginTheme.name;

          if (shouldGenerateTonalPalettes) {
            this.createTonalPalettes(
              requiredThemeName,
              requiredTheme.palettes,
              ref,
            );
          }

          if (shouldGenerateStateLayers) {
            for (const scheme in requiredTheme.schemes) {
              const jsonScheme: JsonScheme =
                requiredTheme.schemes[scheme as keyof Schemes].toJSON();
              this.createStateLayerColors(
                requiredThemeName,
                scheme,
                jsonScheme,
                ref,
              );
            }
          }
        }
      },
    );
  }

  deleteTheme(deleteTheme: string): Promise<void> {
    const ref = Math.random();
    this.sendMessage("delete-library-theme", {
      themeName: deleteTheme,
      ref,
    } as DeleteLocalLibraryThemeData);

    return new Promise((resolve: () => void) => {
      // TODO Show progress bar like in creation
      resolve();
    });
  }

  private createColorScheme(
    themeName: string,
    name: string,
    jsonScheme: JsonScheme,
    ref: number,
  ) {
    for (const colorName in jsonScheme) {
      const argbColor = jsonScheme[colorName];
      this.createColor(
        {
          color: hexFromArgb(argbColor),
          path: `${themeName}/scheme/${name}`,
          name: colorName,
        } as LibraryColor,
        ref,
      );
    }
  }

  private createStateLayerColors(
    themeName: string,
    name: string,
    jsonScheme: JsonScheme,
    ref: number,
  ) {
    for (const colorName in jsonScheme) {
      const argbColor = jsonScheme[colorName];
      stateOpacities.forEach((opacity) => {
        const color = hexFromArgb(argbWithOpacity(argbColor, opacity));
        this.createColor(
          {
            color,
            opacity,
            path: `${themeName}/state-layers/${name}/${colorName}`,
            name: `opacity-${opacity.toFixed(2).toString()}`,
          } as LibraryColor,
          ref,
        );
      });
    }
  }

  private createTonalPalettes(
    themeName: string,
    palettes: Palettes,
    ref: number,
  ) {
    for (const palette in palettes) {
      const tonalPalette: TonalPalette = palettes[palette as keyof Palettes];
      this.createColorPalette(themeName, palette, tonalPalette, ref);
    }
  }

  private createColorPalette(
    themeName: string,
    name: string,
    palette: TonalPalette,
    ref: number,
  ) {
    toneValues.forEach((tone) => {
      const argbColor = palette.tone(tone);
      this.createColor(
        {
          color: hexFromArgb(argbColor),
          path: `${themeName}/palettes`,
          name: `${name}-${tone.toString()}`,
        } as LibraryColor,
        ref,
      );
    });
  }

  private createColor(color: LibraryColor, ref: number) {
    this.sendMessage("create-color", { color, ref } as ColorData);
  }
}

export { MessageThemeBuilderService };
export type { ThemeBuilderService };
