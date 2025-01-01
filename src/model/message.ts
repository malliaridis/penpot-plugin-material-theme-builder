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
type MessageData = PenpotData | PluginData;

/**
 * Message with predefined types.
 */
interface Message<T> {
  source: MessageSource;
  type: string;
  data: T;
}

type PenpotData =
  | PenpotThemeData
  | PenpotColorsData
  | PenpotShapesData
  | PenpotColorData;

type PluginData =
  | CreateLocalLibraryColorData
  | UpdateLibraryColorData
  | SwapColorsData
  | DeleteLocalLibraryThemeData;

interface CreateLocalLibraryColorData {
  color: string;
  group: string;
  name: string;
  ref: number;
}

interface UpdateLibraryColorData {
  /**
   * Library color to update
   */
  color: LibraryColor;
  /**
   * New path of the color to set
   */
  path: string;
  /**
   * New color value to use
   */
  value: string;
  /**
   * Reference number for traceability.
   */
  ref: number;
}

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
}

interface DeleteLocalLibraryThemeData {
  themeName: string;
  ref: number;
}

interface PenpotThemeData {
  theme: string;
}

interface PenpotColorsData {
  colors: LibraryColor[];
}

interface PenpotShapesData {
  shapes: Shape[];
}

interface PenpotColorData {
  color: LibraryColor;
  ref: number;
}

export type {
  MessageSource,
  MessageData,
  Message,
  PenpotData,
  PluginData,
  PenpotThemeData,
  PenpotColorsData,
  PenpotShapesData,
  PenpotColorData,
  CreateLocalLibraryColorData,
  UpdateLibraryColorData,
  SwapColorsData,
  DeleteLocalLibraryThemeData,
  ColorMap,
};
