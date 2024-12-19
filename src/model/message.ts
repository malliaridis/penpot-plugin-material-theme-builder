/**
 * Well-known message types.
 */
type MessageType = "generate-theme" | "penpot";

type MessageData = GenerateThemeData | PenpotData;

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

export interface PenpotMessage {
  type: "penpot";
  data: PenpotData;
}

export interface PenpotData {
  source: string;
  theme: "string";
}
