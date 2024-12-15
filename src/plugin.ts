import { createThemeColors } from "./material3-theme-builder.ts";

penpot.ui.open("Material 3 Theme Builder", `?theme=${penpot.theme}`);

penpot.ui.onMessage<string>((message) => {
  switch (message) {
    case "generate-theme":
      // TODO Allow user to provide theme name and color through message data
      createThemeColors("iron-theme", "#F0F020");
      break;
  }
});
