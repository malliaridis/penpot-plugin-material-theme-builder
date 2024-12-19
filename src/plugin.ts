import { createThemeColors } from "./material-theme-builder.ts";
import { GenerateThemeData, Message } from "./model/message.ts";

penpot.ui.open("Material Theme Builder", `?theme=${penpot.theme}`);

penpot.ui.onMessage<Message>((message) => {
  switch (message.type) {
    case "generate-theme": {
      const { themeName, sourceColorHex } = message.data as GenerateThemeData;
      createThemeColors(themeName, sourceColorHex);
      break;
    }
  }
});
