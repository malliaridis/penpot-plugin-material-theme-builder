import { createThemeColors } from "./material-theme-builder.ts";
import {
  GenerateThemeData,
  Message,
  ValidateAndSetColor,
} from "./model/message.ts";

penpot.ui.open("Material Theme Builder", `?theme=${penpot.theme}`);

penpot.ui.onMessage<Message>((message) => {
  switch (message.type) {
    case "generate-theme": {
      const { themeName, sourceColorHex } = message.data as GenerateThemeData;
      createThemeColors(themeName, sourceColorHex);
      break;
    }
    case "validate-and-set-color": {
      const { sourceColorRaw } = message.data as ValidateAndSetColor;
      const color = getValidSourceColor(sourceColorRaw);
      if (color) {
        penpot.ui.sendMessage({
          type: "color-value-changed",
          data: {
            color: color,
          },
        });
      }
    }
  }
});

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

function getValidSourceColor(raw: string): string | undefined {
  let colorRaw = raw;
  if (colorRaw.startsWith("#")) {
    colorRaw = colorRaw.substring(1);
  }
  if (colorRaw.length == 1) {
    colorRaw = colorRaw.repeat(6);
  }
  if (colorRaw.length == 2) {
    colorRaw = colorRaw.repeat(3);
  }
  if (colorRaw.length == 3) {
    colorRaw = colorRaw.repeat(2);
  }
  colorRaw = `#${colorRaw}`;

  if (hexColorRegex.test(colorRaw)) return colorRaw;
  else return undefined;
}
