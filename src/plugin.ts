import { CreateLocalLibraryColorData, Message } from "./model/message.ts";

penpot.ui.open("Material Theme Builder", `?theme=${penpot.theme}`);

penpot.ui.onMessage<Message>((message) => {
  switch (message.type) {
    case "create-local-library-color": {
      const { color, group, name } =
        message.data as CreateLocalLibraryColorData;
      createLocalLibraryColor(color, group, name);
      break;
    }
  }
});

const createLocalLibraryColor = (
  color: string,
  group: string,
  name: string,
) => {
  const colorRef = penpot.library.local.createColor();
  colorRef.color = color;
  colorRef.path = group;
  colorRef.name = name;
};
