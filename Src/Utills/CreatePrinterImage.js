import { Skia } from "@shopify/react-native-skia";
import TcpSocket from "react-native-tcp-socket";
import { FONTS, PRINTER_COMMANDS } from "../Src-1/Utills/Themedata";
import { pngToRaster } from "./PngToRaster";

// Load custom fonts once
const TrajanPro = require("../Src-1/Assets/Fonts/TrajanPro-Regular.ttf");
const TrajanProBold = require("../Src-1/Assets/Fonts/TrajanPro-Bold.otf");

/**
 * Create printer image using Skia and custom fonts
 */
export async function createPrinterImage({
  text,
  fontSize = 22,
  width = 576,
  padding = 8,
  bold = false,
}) {
  try {
    console.log("🎨 Creating printer image with custom fonts...");

    const fontFile = bold ? TrajanProBold : TrajanPro;
    const fontData = await fetch(fontFile).then((res) => res.arrayBuffer());
    const skFont = Skia.Font(Skia.Typeface.MakeFromData(fontData), fontSize);

    const lines = text.split("\n");
    const lineHeight = fontSize * 1.2;
    const height = Math.max(padding * 2 + lines.length * lineHeight, 100);

    const surface = Skia.Surface.Make(width, height);
    if (!surface) throw new Error("Could not create Skia surface");

    const canvas = surface.getCanvas();
    canvas.clear(Skia.Color("white"));

    const paint = Skia.Paint();
    paint.setColor(Skia.Color("black"));

    lines.forEach((line, index) => {
      const y = padding + fontSize + index * lineHeight;
      canvas.drawText(line, padding, y, skFont, paint);
    });

    const image = surface.makeImageSnapshot();
    if (!image) throw new Error("Failed to make image snapshot");

    const pngBytes = image.encodeToBytes();
    if (!pngBytes) throw new Error("Failed to encode PNG");

    const base64 = arrayBufferToBase64(pngBytes);
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.error("❌ createPrinterImage error:", err);
    throw err;
  }
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Print text with custom fonts
 */
export async function printWithCustomFont({ printerIP, printerPort = 9100, text, bold = false, fontSize = 22, width = 576 }) {
  try {
    const base64PNG = await createPrinterImage({ text, bold, fontSize, width });
    const raster = await pngToRaster(base64PNG.replace(/^data:image\/png;base64,/, ""));

    return new Promise((resolve, reject) => {
      const client = TcpSocket.createConnection({ host: printerIP, port: printerPort }, () => {
        client.write(raster);
        client.write("\x1B\x64\x02"); // feed 2 lines
        setTimeout(() => {
          client.destroy();
          resolve();
        }, 500);
      });

      client.on("error", (err) => {
        client.destroy();
        reject(err);
      });

      setTimeout(() => {
        if (client && client.writable) {
          client.destroy();
          reject(new Error("Print timeout"));
        }
      }, 10000);
    });
  } catch (err) {
    console.warn("Custom font print failed, falling back to simple text:", err);
    // fallback
    return printSimpleText({ printerIP, printerPort, text });
  }
}

/**
 * Simple fallback text print
 */
export async function printSimpleText({ printerIP, printerPort = 9100, text }) {
  return new Promise((resolve, reject) => {
    const client = TcpSocket.createConnection({ host: printerIP, port: printerPort }, () => {
      let data = PRINTER_COMMANDS.INIT + FONTS.NORMAL + text + PRINTER_COMMANDS.FEED_LINES(3) + PRINTER_COMMANDS.CUT;
      client.write(data, "binary", (err) => {
        if (err) return reject(err);
        setTimeout(() => { client.destroy(); resolve(); }, 500);
      });
    });

    client.on("error", (err) => { client.destroy(); reject(err); });
  });
}
