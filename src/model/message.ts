/**
 * Well-known message types.
 */
type MessageType =
  | "generate-theme"
  | "validate-and-set-color"
  | "color-value-changed"
  | "create-local-library-color"
  | "penpot";

type MessageData =
  | GenerateThemeData
  | ValidateAndSetColor
  | PenpotData
  | CreateLocalLibraryColorData
  | ColorValueChanged;

/**
 * Message with predefined types.
 */
interface Message {
  type: MessageType;
  data: MessageData;
}

interface CreateLocalLibraryColorData {
  color: string;
  group: string;
  name: string;
}

interface GenerateThemeMessage extends Message {
  type: "generate-theme";
  data: GenerateThemeData;
}

interface GenerateThemeData {
  themeName: string;
  sourceColorHex: string;
}

interface ValidateAndSetColor {
  themeName: string;
  sourceColorRaw: string;
}

interface PenpotMessage {
  type: "penpot";
  data: PenpotData;
}

interface ColorValueChangedMessage {
  type: "color-value-changed";
  data: ColorValueChanged;
}

interface PenpotData {
  source: string;
  theme: "string";
}

interface ColorValueChanged {
  color: string;
}

export type {
  MessageType,
  MessageData,
  Message,
  GenerateThemeMessage,
  GenerateThemeData,
  ValidateAndSetColor,
  PenpotMessage,
  ColorValueChangedMessage,
  PenpotData,
  ColorValueChanged,
  CreateLocalLibraryColorData,
};
