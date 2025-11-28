import { PNG } from "pngjs/browser";

/**
 * Converts a PNG buffer to ESC/POS raster format
 * Accepts raw PNG bytes (can be from Skia encoded PNG if needed)
 */
export function rgbaToRaster({ width, height, pixels }) {
  let raster = Buffer.alloc(0);
  const bytesPerRow = Math.ceil(width / 8);

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(bytesPerRow);
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) * 4;
      const r = pixels[idx]; // Red channel
      if (r < 200) {
        row[x >> 3] |= 0x80 >> (x & 0x07);
      }
    }
    raster = Buffer.concat([raster, row]);
  }

  const header = Buffer.from([
    0x1d, 0x76, 0x30, 0x00, // GS v 0
    bytesPerRow & 0xff,
    (bytesPerRow >> 8) & 0xff,
    height & 0xff,
    (height >> 8) & 0xff,
  ]);

  return Buffer.concat([header, raster]);
}

/**
 * For legacy base64 PNG conversion
 */
export async function pngToRaster(base64) {
  const pngBuffer = Buffer.from(base64, "base64");
  const png = PNG.sync.read(pngBuffer);
  const { width, height, data } = png;

  let raster = Buffer.alloc(0);
  const bytesPerRow = Math.ceil(width / 8);

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(bytesPerRow);
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) * 4;
      const pixel = data[idx];
      if (pixel < 200) row[x >> 3] |= 0x80 >> (x & 0x07);
    }
    raster = Buffer.concat([raster, row]);
  }

  const header = Buffer.from([
    0x1d, 0x76, 0x30, 0x00,
    bytesPerRow & 0xff,
    (bytesPerRow >> 8) & 0xff,
    height & 0xff,
    (height >> 8) & 0xff,
  ]);

  return Buffer.concat([header, raster]);
}
