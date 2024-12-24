/**
 * Well-known message types.
 */
type MessageType =
  | "generate-theme"
  | "validate-and-set-color"
  | "color-value-changed"
  | "penpot";

type MessageData =
  | GenerateThemeData
  | ValidateAndSetColor
  | PenpotData
  | ColorValueChanged;

/**
 * Message with predefined types.
 */
export interface Message {
  type: MessageType;
  data: MessageData;
}

export interface GenerateThemeMessage extends Message {
  type: "generate-theme";
  data: GenerateThemeData;
}

export interface GenerateThemeData {
  themeName: string;
  sourceColorHex: string;
}

export interface ValidateAndSetColor {
  themeName: string;
  sourceColorRaw: string;
}

export interface PenpotMessage {
  type: "penpot";
  data: PenpotData;
}

export interface ColorValueChangedMessage {
  type: "color-value-changed";
  data: ColorValueChanged;
}

export interface PenpotData {
  source: string;
  theme: "string";
}

export interface ColorValueChanged {
  color: string;
}
