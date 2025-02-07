import {
  ColorData,
  ColorMap,
  PenpotColorsData,
  DeleteLocalLibraryThemeData,
  Message,
  MessageData,
  PenpotData,
  PenpotMappingData,
  PenpotShapesData,
  SwapColorsData,
} from "./model/message.ts";
import {
  Board,
  Fill,
  Group,
  Library,
  LibraryColor,
  Page,
  Shape,
  Stroke,
} from "@penpot/plugin-types";

penpot.ui.open("Material Theme Builder", `?theme=${penpot.theme}`);

penpot.ui.onMessage<Message<MessageData>>((message) => {
  if (message.source != "plugin") {
    // Ignore any event not coming from the plugin
    return;
  }

  switch (message.type) {
    case "create-colors": {
      // Avoid this key
      const { colors, ref } = message.data as PenpotColorsData;
      createColors(colors, ref);
      break;
    }
    case "create-color": {
      const { color, ref } = message.data as ColorData;
      createColor(color, ref);
      break;
    }
    case "update-colors": {
      // Avoid this key
      const { colors, ref } = message.data as PenpotColorsData;
      updateColors(colors, ref);
      break;
    }
    case "update-color": {
      const { color, ref } = message.data as ColorData;
      updateColor(color, ref);
      break;
    }
    case "remove-colors": {
      // Avoid this key
      const { colors, ref } = message.data as PenpotColorsData;
      removeColors(colors, ref);
      break;
    }
    case "remove-color": {
      // Avoid this key
      const { color, ref } = message.data as ColorData;
      removeColor(color, ref);
      break;
    }
    case "load-local-library-colors": {
      loadLocalLibraryColors();
      loadAllLibraryColors();
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
      deleteColorGroup(themeName, ref);
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

function createColors(colors: LibraryColor[], ref: number) {
  colors.forEach((color) => {
    createColor(color, ref);
  });
}

function createColor(color: LibraryColor, ref: number) {
  const colorRef = penpot.library.local.createColor();

  applyValues(colorRef, color);

  penpot.ui.sendMessage({
    source: "penpot",
    type: "color-created",
    data: { color: colorRef, ref } as ColorData,
  } as Message<ColorData>);
}

function updateColors(colors: LibraryColor[], ref: number) {
  colors.forEach((color) => {
    updateColor(color, ref);
  });
}

function updateColor(color: LibraryColor, ref: number) {
  const colorRef = penpot.library.local.colors.find((localColor) => {
    return localColor.id === color.id;
  });
  if (!colorRef) {
    console.warn(`Color with ID ${color.id} not found.`);
    return;
  }

  applyValues(colorRef, color);

  penpot.ui.sendMessage({
    source: "penpot",
    type: "color-updated",
    data: { color: colorRef, ref } as ColorData,
  } as Message<ColorData>);
}

function removeColors(colors: LibraryColor[], ref: number) {
  colors.forEach((color) => {
    removeColor(color, ref);
  });
}

function removeColor(color: LibraryColor, ref: number) {
  console.warn("Penpot API does not support removals. Skipping...");
  // TODO Implement removal once supported.
  penpot.ui.sendMessage({
    source: "penpot",
    type: "color-removed",
    data: { color, ref } as ColorData,
  } as Message<ColorData>);
}

function applyValues(color: LibraryColor, apply: LibraryColor) {
  const finalName = apply.name ? apply.name : color.name;
  const finalPath = apply.path ? apply.path : color.path;

  if (apply.color) color.color = apply.color;
  if (apply.opacity) color.opacity = apply.opacity;
  if (apply.gradient) color.gradient = apply.gradient;
  if (apply.image) color.image = apply.image;
  // Workaround: always set the path and at the end,
  // as it is reset after setting the color
  // See https://tree.taiga.io/project/penpot/issue/9700
  color.name = finalName;
  color.path = finalPath;
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

function deleteColorGroup(parent: string, ref: number) {
  // TODO Implement once the penpot API supports deletion.
  // See https://tree.taiga.io/project/penpot/issue/9701
  console.log(
    `Pretending to delete all assets related to ${parent} with ${ref.toString()} reference.`,
  );
  console.warn("Operation not supported by penpot plugin.");
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
    const strokes = shape.strokes;
    let updated = false;

    const libraryColors = allLibraries().flatMap((library) => library.colors);

    if (isFillArray(fills)) {
      // Use mappings to replace the current fills
      shape.fills = fills.map((fill) => {
        if (fill.fillColorRefId) {
          const mappedColor = mappings[fill.fillColorRefId];
          if (!mappedColor) return fill;

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
    }

    shape.strokes = strokes.map((stroke) => {
      if (stroke.strokeColorRefId) {
        const mappedColor = mappings[stroke.strokeColorRefId];
        if (!mappedColor) return stroke;

        const actualColor = libraryColors.find(
          (color) => color.id == mappedColor.id,
        );

        if (actualColor) {
          updated = true;
          return updateAndGetStroke(stroke, actualColor);
        }
      }
      return stroke;
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
 * Generates a new stroke from {@code color} and applies metadata like opacity
 * and stroke width from existing {@code stroke}.
 *
 * This additional mapping is necessary because converting a color to a stroke
 * would reset existing values.
 *
 * @param stroke The existing stroke to update the color / use the metadata from
 * @param color The color to use for the new stroke
 * @return a new Stroke
 */
function updateAndGetStroke(stroke: Stroke, color: LibraryColor) {
  const newStroke = color.asStroke(); // covers color values and opacity
  newStroke.strokeAlignment = stroke.strokeAlignment;
  newStroke.strokeStyle = stroke.strokeStyle;
  newStroke.strokeCapStart = stroke.strokeCapStart;
  newStroke.strokeCapEnd = stroke.strokeCapEnd;
  newStroke.strokeWidth = stroke.strokeWidth;
  newStroke.strokeColorGradient = stroke.strokeColorGradient;
  return newStroke;
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
