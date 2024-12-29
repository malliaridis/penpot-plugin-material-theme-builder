import {
  CreateLocalLibraryColorData,
  DeleteLocalLibraryThemeData,
  Message,
  MessageData,
  PenpotColorData,
  PenpotData,
  UpdateLibraryColorData,
} from "./model/message.ts";
import { LibraryColor } from "@penpot/plugin-types";

penpot.ui.open("Material Theme Builder", `?theme=${penpot.theme}`);

penpot.ui.onMessage<Message<MessageData>>((message) => {
  if (message.source != "plugin") {
    // Ignore any event not coming from the plugin
    return;
  }

  switch (message.type) {
    case "create-local-library-color": {
      const { color, group, name, ref } =
        message.data as CreateLocalLibraryColorData;
      const newColor = createLocalLibraryColor(color, group, name);
      sendColorCreatedMessage(newColor, ref);
      break;
    }
    case "load-local-library-colors": {
      loadLocalLibraryColors();
      break;
    }
    case "update-library-color": {
      updateLibraryColor(message.data as UpdateLibraryColorData);
      break;
    }
    case "delete-library-theme": {
      const { themeName, ref } = message.data as DeleteLocalLibraryThemeData;
      deleteLocalLibraryColors(themeName, ref);
      break;
    }
  }
});

function createLocalLibraryColor(
  color: string,
  group: string,
  name: string,
): LibraryColor {
  const colorRef = penpot.library.local.createColor();
  colorRef.color = color;
  colorRef.path = group;
  colorRef.name = name;
  return colorRef;
}

function loadLocalLibraryColors() {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "library-colors-fetched",
    data: {
      colors: penpot.library.local.colors,
    },
  } as Message<PenpotData>);
}

function deleteLocalLibraryColors(themeName: string, ref: number) {
  // TODO Implement me once the penpot API supports deletion.
  console.log(
    `Pretending to delete all assets related to ${themeName} with ${ref.toString()} reference.`,
  );
  console.warn("Operation not supported by penpot plugin.");
}

function sendColorCreatedMessage(color: LibraryColor, ref: number) {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "library-color-created",
    data: { color, ref } as PenpotColorData,
  } as Message<PenpotData>);
}

function updateLibraryColor(update: UpdateLibraryColorData) {
  const { color, path, value, ref } = update;

  const penpotColor = penpot.library.local.colors.find(
    (c) => c.id === color.id,
  );
  if (!penpotColor) return;

  if (value) {
    penpotColor.color = value;
  }
  if (path) {
    penpotColor.path = path;
  }

  penpot.ui.sendMessage({
    source: "penpot",
    type: "library-color-updated",
    data: {
      color: penpotColor,
      ref: ref,
    } as PenpotColorData,
  } as Message<PenpotData>);
}
