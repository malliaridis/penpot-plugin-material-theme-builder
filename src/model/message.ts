import { LibraryColor, Shape } from "@penpot/plugin-types";

/**
 * The source of the messages.
 *
 * A message is either coming from penpot or from the plugin.
 */
type MessageSource = "penpot" | "plugin";

/**
 * The message data that can be either a penpot message or a plugin message,
 * depending on the source.
 */
type MessageData = PenpotData | PluginData | PenpotColorsData | ColorData;

/**
 * Message with predefined types.
 */
interface Message<T> {
  source: MessageSource;
  type: string;
  data: T;
}

type PenpotData =
  | ThemeData
  | PenpotMappingData
  | PenpotColorsData
  | PenpotShapesData;

type PluginData = SwapColorsData | DeleteLocalLibraryThemeData;

/**
 * Color map that links a string / ID with a {@link LibraryColor}.
 * Depending on the use case, a key may or may not be the ID of the same color
 * as the value's color ID.
 */
type ColorMap = Record<string, LibraryColor | undefined>;

/**
 * Data object that holds color mappings for swapping colors.
 */
interface SwapColorsData {
  /**
   * Color mappings that links the ID of a {@link LibraryColor} that should be
   * replaced with its value {@link LibraryColor}.
   */
  mappings: ColorMap;
  ref: number;
}

interface DeleteLocalLibraryThemeData {
  themeName: string;
  ref: number;
}

interface ThemeData {
  theme: string;
  ref: number;
}

/**
 * Mapping data sent by penpot when mapping assets. Currently not used.
 */
interface PenpotMappingData {
  /**
   * The ID of the shape that was checked.
   */
  id?: string;
  /**
   * The mappings that are to be processed, if starting the mapping.
   */
  size?: number;
  /**
   * Whether the shape with the ID was updated.
   */
  updated: boolean;
  /**
   * Reference number.
   */
  ref: number;
}

/**
 * Message data that holds a collection of colors, all associated with the same
 * reference number.
 *
 * This interface should only be used when sending data from penpot to the
 * plugin. Using it for bulk operations may render the penpot plugin
 * unresponsive during processing. Prefer in this case {@link ColorData}
 * instead.
 */
interface PenpotColorsData {
  colors: LibraryColor[];
  ref: number;
}

/**
 * Message data that holds a single color and a reference number.
 */
interface ColorData {
  color: LibraryColor;
  ref: number;
}

interface PenpotShapesData {
  shapes: Shape[];
}

export type {
  MessageSource,
  MessageData,
  Message,
  PenpotData,
  PluginData,
  ThemeData,
  PenpotMappingData,
  PenpotColorsData,
  PenpotShapesData,
  SwapColorsData,
  DeleteLocalLibraryThemeData,
  ColorMap,
  ColorData,
};
