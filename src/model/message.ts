import { LibraryColor } from "@penpot/plugin-types";

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

type PenpotData = PenpotThemeData | PenpotColorsData | PenpotColorData;

type PluginData =
  | CreateLocalLibraryColorData
  | UpdateLibraryColorData
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
  PenpotColorData,
  CreateLocalLibraryColorData,
  UpdateLibraryColorData,
  DeleteLocalLibraryThemeData,
};
