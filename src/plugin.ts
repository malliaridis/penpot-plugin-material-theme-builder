import {
  ColorMap,
  CreateLocalLibraryColorData,
  DeleteLocalLibraryThemeData,
  Message,
  MessageData,
  PenpotColorData,
  PenpotColorsData,
  PenpotData,
  PenpotMappingData,
  PenpotShapesData,
  SwapColorsData,
  UpdateLibraryColorData,
} from "./model/message.ts";
import {
  Board,
  Fill,
  Group,
  Library,
  LibraryColor,
  Page,
  Shape,
} from "@penpot/plugin-types";

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
      loadAllLibraryColors();
      break;
    }
    case "update-library-color": {
      updateLibraryColor(message.data as UpdateLibraryColorData);
      break;
    }
    case "update-current-page-colors": {
      const { mappings, ref } = message.data as SwapColorsData;
      updateCurrentPageColors(mappings, ref);
      break;
    }
    case "update-current-selection-colors": {
      const { mappings, ref } = message.data as SwapColorsData;
      updateCurrentSelectionColors(mappings, ref);
      break;
    }
    case "delete-library-theme": {
      const { themeName, ref } = message.data as DeleteLocalLibraryThemeData;
      deleteLocalLibraryColors(themeName, ref);
      break;
    }
  }
});

// Update the selection in the penpot context
penpot.on("selectionchange", () => {
  const shapes = penpot.selection;
  penpot.ui.sendMessage({
    source: "penpot",
    type: "selection-changed",
    data: {
      shapes: shapes,
    },
  } as Message<PenpotShapesData>);
});

// Update the theme in the iframe
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "theme-changed",
    data: { theme },
  });
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
  } as Message<PenpotColorsData>);
}

function loadAllLibraryColors() {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "all-library-colors-fetched",
    data: {
      // TODO Distinguish colors from different libraries to avoid theme merging
      colors: allLibraries().flatMap((library) => library.colors),
    },
  } as Message<PenpotColorsData>);
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

function updateCurrentPageColors(mappings: ColorMap, ref: number) {
  const page = penpot.currentPage;
  if (!page) {
    console.error("Current page not available.");
    return;
  }

  updatePageColors(penpot.currentPage, mappings, ref);
}

function updateCurrentSelectionColors(mappings: ColorMap, ref: number) {
  const selection = penpot.selection;
  if (selection.length == 0) {
    console.error("Current selection is empty.");
    return;
  }

  updateShapeColors(selection, mappings, ref);
}

function updatePageColors(page: Page, mappings: ColorMap, ref: number) {
  const shapes = page.findShapes();
  updateShapeColors(shapes, mappings, ref);
}

function updateShapeColors(shapes: Shape[], mappings: ColorMap, ref: number) {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "shape-color-mapping-started",
    data: {
      size: shapes.length,
      ref,
    } as PenpotMappingData,
  });

  shapes.forEach((shape) => {
    const fills = shape.fills;
    let updated = false;

    if (!isFillArray(fills)) {
      penpot.ui.sendMessage({
        source: "penpot",
        type: "shape-colors-updated",
        data: {
          id: shape.id,
          updated,
          ref,
        } as PenpotMappingData,
      } as Message<PenpotData>);
      return;
    }

    // Use mappings to replace the curren fills
    shape.fills = fills.map((fill) => {
      if (fill.fillColorRefId) {
        const mappedColor = mappings[fill.fillColorRefId];
        if (!mappedColor) return fill;

        const libraryColors = allLibraries().flatMap(
          (library) => library.colors,
        );
        const actualColor = libraryColors.find(
          (color) => color.id == mappedColor.id,
        );
        if (actualColor) {
          updated = true;
          return actualColor.asFill();
        }
      }
      return fill;
    });

    penpot.ui.sendMessage({
      source: "penpot",
      type: "shape-colors-updated",
      data: {
        id: shape.id,
        updated,
        ref,
      } as PenpotMappingData,
    } as Message<PenpotData>);

    if (hasChildren(shape)) updateShapeColors(shape.children, mappings, ref);
  });

  penpot.ui.sendMessage({
    source: "penpot",
    type: "shape-color-mapping-completed",
    data: {
      ref,
    } as PenpotMappingData,
  });
}

/**
 * Determines whether a value is a {@link Fill} array.
 *
 * @param value the value to check
 * @return `true` iff the value is a Fill array
 */
function isFillArray(value: Fill[] | "mixed"): value is Fill[] {
  return Array.isArray(value);
}

/**
 * Determines whether a shape is a {@link Board}.
 *
 * @param shape the shape to check
 * @return `true` iff the value is a Board
 */
function hasChildren(shape: Shape): shape is Board | Group {
  return "children" in shape;
}

function allLibraries(): Library[] {
  return [penpot.library.local, ...penpot.library.connected];
}
