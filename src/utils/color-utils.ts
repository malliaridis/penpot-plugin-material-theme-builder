const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

function getValidSourceColor(
  raw: string | undefined | null,
): string | undefined {
  if (!raw) return undefined;

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

// Function to combine ARGB components into a single integer
function argbWithOpacity(argb: number, opacity: number): number {
  if (opacity < 0 || opacity > 1) {
    throw new Error("Opacity must be a value between 0 and 1");
  }
  // Extract the alpha channel (most significant 8 bits)
  const originalAlpha = (argb >> 24) & 0xff;

  // Scale the alpha by the opacity value
  const newAlpha = Math.round(originalAlpha * opacity);

  // Combine and return the new alpha with the original RGB values
  return (newAlpha << 24) | (argb & 0x00ffffff);
}

export { getValidSourceColor, argbWithOpacity };
