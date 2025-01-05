import { MessageService } from "./MessageService.ts";
import { ColorMap, SwapColorsData } from "../model/message.ts";
import { PluginTheme } from "../model/material.ts";
import { colorCompare, flattenColors } from "../utils/color-utils.ts";

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
    const mappings = this.createThemeMappingsFrom(theme, useDarkTheme);

    if (!mappings)
      return Promise.reject(new Error("Could not generate color mappings."));

    const updateKey = forSelection
      ? "update-current-selection-colors"
      : "update-current-page-colors";

    // TODO Display notification

    // TODO Update notification during progress

    // TODO Hide notification on completion

    this.sendMessage(updateKey, {
      mappings,
    } as SwapColorsData);

    // TODO remove below promise once notification bar implemented
    return Promise.resolve();
  }

  replaceThemes(
    forSelection: boolean,
    toReplace: PluginTheme,
    replaceWith: PluginTheme,
  ): Promise<void> {
    const mappings = this.createThemeMappingsWith(toReplace, replaceWith);

    const updateKey = forSelection
      ? "update-current-selection-colors"
      : "update-current-page-colors";

    // TODO Display notification

    // TODO Update notification during progress

    // TODO Hide notification on completion

    this.sendMessage(updateKey, {
      mappings,
    } as SwapColorsData);

    // TODO remove below promise once notification bar implemented
    return Promise.resolve();
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
}

export { MessageThemeToolsService };
export type { ThemeToolsService };
