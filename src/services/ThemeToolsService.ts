import { MessageService } from "./MessageService.ts";
import {
  ColorMap,
  ColorsData,
  Message,
  MessageData,
  PenpotColorData,
  PenpotMappingData,
  SwapColorsData,
} from "../model/message.ts";
import { PluginTheme } from "../model/material.ts";
import { colorCompare, flattenColors } from "../utils/color-utils.ts";
import { ToastData } from "../model/ToastData.ts";
import { LibraryColor } from "@penpot/plugin-types";

/**
 * Theme tools service that provides various operations that can be applied to
 * the current file.
 */
interface ThemeToolsService {
  /**
   * Swaps the colors of shapes with the colors of the selected theme, by
   * applying light or dark theme colors.
   *
   * For example, if the shapes of the current selection use the light colors
   * of the {@code theme}, and with {@code useDarkTheme} is set to `true`, the
   * function will replace the light colors with the dark colors.
   *
   * Colors that do not have any mapping, or use a different theme are not
   * changed.
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

  /**
   * Replaces the colors of {@code toReplace} with the equivalent colors of
   * {@code replaceWith} for a selection or page.
   *
   * @param forSelection
   * @param toReplace
   * @param replaceWith
   */
  replaceThemes(
    forSelection: boolean,
    toReplace: PluginTheme,
    replaceWith: PluginTheme,
  ): Promise<void>;

  /**
   * Updates the {@code theme}'s values with the equivalent values of
   * {@code update}.
   *
   * @param theme The theme to update
   * @param update The theme to use for updating {@code theme}
   * @param addNewColors Whether to add any color that is absent in
   * {@code theme} and present in {@code update}.
   * @param removeExtraColors Whether to remove any color that is present in
   * {@code theme} and absent in {@code update}.
   */
  updateTheme(
    theme: PluginTheme,
    update: PluginTheme,
    addNewColors: boolean,
    removeExtraColors: boolean,
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

  async updateTheme(
    theme: PluginTheme,
    update: PluginTheme,
    addNewColors: boolean,
    removeExtraColors: boolean,
  ): Promise<void> {
    const ref = Math.random();

    this.onUpdate({
      type: "progress-started",
      message: "Preparing theme update...",
      ref,
    } as ToastData);

    const { additions, updates, removals } = this.createChanges(
      theme,
      update,
      addNewColors,
      removeExtraColors,
    );

    const totalChanges = additions.length + updates.length + removals.length;

    await this.createAssets(additions, totalChanges, ref);
    await this.updateAssets(updates, totalChanges, ref);
    await this.removeAssets(removals, totalChanges, ref);

    this.onUpdate({
      type: "progress-completed",
      message: "Theme updated successfully.",
      ref,
    } as ToastData);
  }

  private async createAssets(
    additions: LibraryColor[],
    totalChanges: number,
    ref: number,
  ): Promise<void> {
    let additionsCount = 0;

    this.onUpdate({
      type: "progress-updated",
      message: "Creating new assets...",
      loaded: additionsCount,
      total: totalChanges,
      ref,
    } as ToastData);

    await new Promise((resolve: (value?: unknown) => void) => {
      if (additions.length == 0) resolve();

      const listener = (event: MessageEvent<Message<MessageData>>) => {
        if (
          event.data.source != "penpot" ||
          event.data.type != "color-created"
        ) {
          return;
        }

        // Right now we are only mapping colors, so we receive color data
        const data = event.data.data as PenpotColorData;

        if (data.ref != ref) return;

        this.onUpdate({
          type: "progress-updated",
          loaded: ++additionsCount,
          total: totalChanges,
          message: "Creating assets...",
          ref,
        } as ToastData);

        if (additionsCount == additions.length) {
          window.removeEventListener("message", listener);
          resolve();
        }
      };

      window.addEventListener("message", listener);

      this.sendMessage("create-colors", {
        colors: additions,
        ref,
      } as ColorsData);
    });
  }

  private async updateAssets(
    updates: LibraryColor[],
    totalChanges: number,
    ref: number,
  ) {
    let updateCount = 0;

    this.onUpdate({
      type: "progress-updated",
      message: "Updating assets...",
      loaded: updateCount,
      total: totalChanges,
      ref,
    } as ToastData);

    await new Promise((resolve: (value?: unknown) => void) => {
      if (updates.length == 0) resolve();

      const listener = (event: MessageEvent<Message<MessageData>>) => {
        if (
          event.data.source != "penpot" ||
          event.data.type != "color-updated"
        ) {
          return;
        }

        // Right now we are only mapping colors, so we receive color data
        const data = event.data.data as PenpotColorData;

        if (data.ref != ref) return;

        this.onUpdate({
          type: "progress-updated",
          loaded: ++updateCount,
          total: totalChanges,
          message: "Updating existing assets...",
          ref,
        } as ToastData);

        if (updateCount == updates.length) {
          window.removeEventListener("message", listener);
          resolve();
        }
      };

      window.addEventListener("message", listener);

      this.sendMessage("update-colors", {
        colors: updates,
        ref,
      } as ColorsData);
    });
  }

  private async removeAssets(
    removals: LibraryColor[],
    totalChanges: number,
    ref: number,
  ) {
    let removeCount = 0;

    this.onUpdate({
      type: "progress-updated",
      message: "Removing assets...",
      loaded: removeCount,
      total: totalChanges,
      ref,
    } as ToastData);

    await new Promise((resolve: (value?: unknown) => void) => {
      if (removals.length == 0) resolve();

      const listener = (event: MessageEvent<Message<MessageData>>) => {
        if (
          event.data.source != "penpot" ||
          event.data.type != "color-removed"
        ) {
          return;
        }

        // Right now we are only mapping colors, so we receive color data
        const data = event.data.data as PenpotColorData;

        if (data.ref != ref) return;

        this.onUpdate({
          type: "progress-updated",
          loaded: ++removeCount,
          total: totalChanges,
          message: "Removing assets...",
          ref,
        } as ToastData);

        if (removeCount == removals.length) {
          window.removeEventListener("message", listener);
          resolve();
        }
      };

      window.addEventListener("message", listener);

      this.sendMessage("remove-colors", {
        colors: removals,
        ref,
      } as ColorsData);
    });
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

  private createChanges(
    theme: PluginTheme,
    update: PluginTheme,
    addNewColors: boolean,
    removeExtraColors: boolean,
  ): {
    additions: LibraryColor[];
    updates: LibraryColor[];
    removals: LibraryColor[];
  } {
    let additions: LibraryColor[] = [];
    const updates: LibraryColor[] = [];
    const removals: LibraryColor[] = [];

    const initialColors = flattenColors(theme, false);
    const updatingColors = flattenColors(update, false);

    initialColors.forEach((color) => {
      const pathSegments = color.path.split(" / ");
      // Remove theme name from path
      pathSegments.shift();

      let index = -1;
      const updateColor = updatingColors.find((localColor, localIndex) => {
        index = localIndex;
        const localSegments = localColor.path.split(" / ");
        localSegments.shift();
        return areArraysEqual(pathSegments, localSegments);
      });

      if (updateColor) {
        color.color = updateColor.color;
        color.opacity = updateColor.opacity;
        color.gradient = updateColor.gradient;
        color.image = updateColor.image;

        // Add color as update
        updates.push(color);

        // Remove color from updating colors
        updatingColors.splice(index, 1);
      } else if (removeExtraColors) {
        removals.push(color);
      }
    });

    if (addNewColors) {
      additions = updatingColors.map((color) => {
        const newColor = {} as LibraryColor;
        newColor.color = color.color;
        newColor.opacity = color.opacity;
        newColor.gradient = color.gradient;
        newColor.image = color.image;
        const pathSegments = color.path.split(" / ");
        pathSegments[0] = theme.name;
        newColor.path = pathSegments.join(" / ");
        return newColor;
      });
    }

    return { additions, updates, removals };
  }
}

function areArraysEqual(array1: string[], array2: string[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }
  return array1.every((value, index) => value === array2[index]);
}

export { MessageThemeToolsService };
export type { ThemeToolsService };
