import { MessageService } from "./MessageService.ts";
import {
  ColorMap,
  Message,
  MessageData,
  PenpotMappingData,
  SwapColorsData,
} from "../model/message.ts";
import { PluginTheme } from "../model/material.ts";
import { colorCompare, flattenColors } from "../utils/color-utils.ts";
import { ToastData } from "../model/ToastData.ts";

/**
 * Theme tools service that provides various operations that can be applied to
 * the current file.
 */
interface ThemeToolsService {
  /**
   * Swaps the colors of shapes with the theme's light or dark theme colors.
   *
   * @param forSelection Whether to limit the update on the selection or to the
   * entire page.
   * @param theme Theme to use the values from.
   * @param useDarkTheme Whether the final result should use dark or light
   * theme colors.
   */
  swapColors(
    forSelection: boolean,
    theme: PluginTheme,
    useDarkTheme: boolean,
  ): Promise<void>;

  replaceThemes(
    forSelection: boolean,
    toReplace: PluginTheme,
    replaceWith: PluginTheme,
  ): Promise<void>;
}

/**
 * The default implementation of {@link ThemeToolsService} that is based on
 * window messages.
 *
 * Since penpot can be used only from plugin.ts, messages are sent received
 * from this service. The messages sent are consumed by penpot.ts, which
 * generates new messages for successful actions. This service then consumes
 * messages sent by penpot.ts for each action to update the state.
 */
class MessageThemeToolsService
  extends MessageService
  implements ThemeToolsService
{
  swapColors(
    forSelection: boolean,
    theme: PluginTheme,
    useDarkTheme: boolean,
  ): Promise<void> {
    const ref = Math.random();

    this.onUpdate({
      type: "progress-started",
      message: "Preparing color mappings...",
      ref,
    } as ToastData);

    const mappings = this.createThemeMappingsFrom(theme, useDarkTheme);

    if (!mappings)
      return Promise.reject(new Error("Could not generate color mappings."));

    const updateKey = forSelection
      ? "update-current-selection-colors"
      : "update-current-page-colors";

    return this.createColorUpdatePromise(mappings, ref, updateKey);
  }

  replaceThemes(
    forSelection: boolean,
    toReplace: PluginTheme,
    replaceWith: PluginTheme,
  ): Promise<void> {
    const ref = Math.random();

    this.onUpdate({
      type: "progress-started",
      message: "Preparing theme mappings...",
      ref,
    } as ToastData);

    const mappings = this.createThemeMappingsWith(toReplace, replaceWith);

    const updateKey = forSelection
      ? "update-current-selection-colors"
      : "update-current-page-colors";

    return this.createColorUpdatePromise(mappings, ref, updateKey);
  }

  private createThemeMappingsFrom(
    theme: PluginTheme,
    useDarkTheme: boolean,
  ): ColorMap | undefined {
    const themeColors = flattenColors(theme, false);
    const lightThemeColors = themeColors
      .filter((color) => color.path.includes(" / light"))
      .sort(colorCompare);

    const darkThemeColors = themeColors
      .filter((color) => color.path.includes(" / dark"))
      .sort(colorCompare);

    if (lightThemeColors.length != darkThemeColors.length) {
      // There are differences in light and dark theme colors that will
      // result in unmapped colors. Do not proceed.
      // Note that this is not fool-proof, but sufficient for now.
      console.error(
        "Light and dark colors differ: " +
          lightThemeColors.length.toString() +
          " light colors, " +
          darkThemeColors.length.toString() +
          " dark colors",
      );
      return undefined;
    }

    const keyColors = useDarkTheme ? lightThemeColors : darkThemeColors;
    const valueColors = useDarkTheme ? darkThemeColors : lightThemeColors;

    return keyColors.reduce<ColorMap>((record, color1, index) => {
      record[color1.id] = valueColors[index];
      return record;
    }, {});
  }

  private createThemeMappingsWith(
    replace: PluginTheme,
    replaceWith: PluginTheme,
  ): ColorMap {
    const replaceColors = flattenColors(replace, false);
    const withColors = flattenColors(replaceWith, false);

    return replaceColors.reduce<ColorMap>((record, color) => {
      record[color.id] =
        withColors.find((withColor) => {
          return (
            color.name == withColor.name &&
            color.path.substring(replace.name.length) ==
              withColor.path.substring(replaceWith.name.length)
          );
        }) ?? color;
      return record;
    }, {});
  }

  private createColorUpdatePromise(
    mappings: ColorMap,
    ref: number,
    updateKey: string,
  ): Promise<void> {
    let shapesFound = 0;
    let shapesIterated = 0;
    let shapesUpdated = 0;

    return new Promise((resolve: () => void) => {
      const listener = (event: MessageEvent<Message<MessageData>>) => {
        if (
          event.data.source != "penpot" ||
          (event.data.type != "shape-colors-updated" &&
            event.data.type != "shape-color-mapping-started" &&
            event.data.type != "shape-color-mapping-completed")
        ) {
          return;
        }

        // Right now we are only mapping colors, so we receive color data
        const data = event.data.data as PenpotMappingData;

        if (data.ref != ref) return;

        if (event.data.type == "shape-color-mapping-started") {
          shapesFound += data.size ?? 0;
          this.onUpdate({
            type: "progress-updated",
            loaded: shapesIterated,
            total: shapesFound,
            message: "Updating shapes...",
            ref,
          } as ToastData);
        }

        if (event.data.type == "shape-colors-updated") {
          if (data.updated) shapesUpdated++;

          this.onUpdate({
            type: "progress-updated",
            loaded: ++shapesIterated,
            total: shapesFound,
            message: "Updating shapes...",
            ref,
          } as ToastData);
        }

        if (
          event.data.type == "shape-color-mapping-completed" &&
          shapesIterated == shapesFound
        ) {
          this.onUpdate({
            type: "progress-completed",
            message: `${shapesUpdated.toString()} shapes updated.`,
            ref,
          } as ToastData);

          window.removeEventListener("message", listener);
          resolve();
        }
      };

      window.addEventListener("message", listener);

      this.sendMessage(updateKey, {
        mappings,
        ref,
      } as SwapColorsData);
    });
  }
}

export { MessageThemeToolsService };
export type { ThemeToolsService };
