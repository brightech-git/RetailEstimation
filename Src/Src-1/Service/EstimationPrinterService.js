import TcpSocket from "react-native-tcp-socket";
import { Alert } from "react-native";
import axios from "axios";
import { FONTS, PRINTER_COMMANDS } from "../Utills/Themedata";

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // DD-MM-YYYY
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-IN", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const mergeItems = (items) => {
  const map = new Map();
  items.forEach((item) => {
    const key = `${item.itemid}-${item.tagno}`;
    if (!map.has(key)) {
      map.set(key, { ...item, taxes: [...(item.taxes || [])] });
    } else {
      const existing = map.get(key);
      existing.pcs += item.pcs || 0;
      existing.netwt += item.netwt || 0;
      existing.grswt += item.grswt || 0;
      existing.amount += item.amount || 0;
      (item.taxes || []).forEach((tax) => {
        const idx = existing.taxes.findIndex((t) => t.tax_id === tax.tax_id);
        if (idx >= 0) existing.taxes[idx].tax_amount += tax.tax_amount || 0;
        else existing.taxes.push({ ...tax });
      });
    }
  });
  return Array.from(map.values());
};

// Helper function to format text with styling
// Enhanced helper function to format text with styling and alignment
const formatStyledLine = (
  leftText,
  rightText,
  style = FONTS.NORMAL,
  align = FONTS.ALIGN_CENTER,
  totalWidth = 40
) => {
  const left = leftText || "";
  const right = rightText || "";

  // Apply 20 characters left padding
  const paddedLeft = " ".repeat(2) + left;

  // Apply alignment first
  let line = align + style + paddedLeft;

  if (right) {
    const spacesNeeded = totalWidth - paddedLeft.length - right.length;
    const spaces = spacesNeeded > 0 ? " ".repeat(spacesNeeded) : " ";
    line += spaces + right;
  }

  // For left-aligned text without right content
  if (!right && align === FONTS.ALIGN_LEFT) {
    line = align + style + paddedLeft;
  }

  return line + FONTS.NORMAL + FONTS.ALIGN_LEFT + "\n";
};

// Fixed-width column formatter
const col = (text, width, align = "left") => {
  text = text?.toString() ?? "";
  if (text.length > width) {
    return text.substring(0, width); // truncate if too long
  }
  if (align === "right") {
    return text.padStart(width, " ");
  }
  return text.padEnd(width, " ");
};

// Table row formatter (matches your printed image layout)
const formatRow = (desc, weight = "", va = "", amt = "") => {
  return (
    col(desc, 24) + // Description column
    col(weight, 10, "right") +
    col(va, 8, "right") +
    col(amt, 10, "right") +
    "\n"
  );
};

// BEST WORKING QR CODE FOR ALL THERMAL PRINTERS (2025 Updated)
const printQRCode = (estimationNo) => {
  if (!estimationNo) estimationNo = "NO_EST";

  const data = estimationNo.toString();
  let qr = "";

  // DO NOT reset printer here — it breaks alignment
  // qr += "\x1B\x40";  <-- removed

  // 1. QR Model 2
  qr += "\x1D\x28\x6B\x04\x00\x31\x41\x32\x00";

  // 2. Module Size = 5
  qr += "\x1D\x28\x6B\x03\x00\x31\x43\x05";

  // 3. Error Correction Level M
  qr += "\x1D\x28\x6B\x03\x00\x31\x45\x49";

  // 4. Store QR Data
  const len = data.length + 3;
  const pL = len % 256;
  const pH = Math.floor(len / 256);

  qr +=
    "\x1D\x28\x6B" +
    String.fromCharCode(pL) +
    String.fromCharCode(pH) +
    "\x31\x50\x30" +
    data;

  // 5. Print QR Code
  qr += "\x1D\x28\x6B\x03\x00\x31\x51\x30";

  // ❌ REMOVED: extra bottom space
  // qr += "\x1B\x64\x03";

  return qr;
};

// CORRECTED QR Code Generation Functions
const generateQRCodeESCPOS = (text) => {
  if (!text) return "";

  let commands = "";

  try {
    console.log("🔳 Generating QR code for:", text);

    // CORRECT ESC/POS QR Code Commands for most thermal printers
    // Using GS commands for QR code

    // Initialize QR code
    commands += "\x1B\x40"; // Initialize printer

    // QR Code: Select Model (Model 2)
    commands += "\x1D\x28\x6B\x04\x00\x31\x41\x32\x00";

    // QR Code: Set Size (3-10, 6 is medium)
    commands += "\x1D\x28\x6B\x03\x00\x31\x43\x06";

    // QR Code: Set Error Correction Level (L=48, M=49, Q=50, H=51)
    commands += "\x1D\x28\x6B\x03\x00\x31\x45\x33";

    // QR Code: Store Data
    const data = text;
    const len = data.length + 3;
    const pL = len & 0xff;
    const pH = (len >> 8) & 0xff;

    commands +=
      "\x1D\x28\x6B" +
      String.fromCharCode(pL) +
      String.fromCharCode(pH) +
      "\x31\x50\x30";
    commands += data;

    // QR Code: Print
    commands += "\x1D\x28\x6B\x03\x00\x31\x51\x30";

    // Add space after QR code
    commands += "\n\n";

    console.log("✅ QR code commands generated successfully");
  } catch (error) {
    console.error("❌ ESC/POS QR Code generation error:", error);
    // Fallback
    commands += FONTS.ALIGN_CENTER;
    commands += `[ QR: ${text} ]\n`;
    commands += "(Scan this code)\n\n";
    commands += FONTS.ALIGN_LEFT;
  }

  return commands;
};

// Alternative method using different ESC/POS commands
const generateQRCodeAlternative = (text) => {
  if (!text) return "";

  let commands = "";

  try {
    console.log("🔳 Generating alternative QR code for:", text);

    // Alternative method using different command structure
    commands += "\x1B\x40"; // Initialize

    // Set QR code function type
    commands += "\x1D\x28\x6B\x04\x00\x31\x41\x32\x00"; // Model 2

    // Set QR code size
    commands += "\x1D\x28\x6B\x03\x00\x31\x43\x08"; // Size 8

    // Set error correction
    commands += "\x1D\x28\x6B\x03\x00\x31\x45\x33"; // Level L

    // Store the data in the symbol storage area
    const dataLength = text.length + 3;
    const pL = dataLength % 256;
    const pH = Math.floor(dataLength / 256);

    commands +=
      "\x1D\x28\x6B" +
      String.fromCharCode(pL) +
      String.fromCharCode(pH) +
      "\x31\x50\x30";
    commands += text;

    // Print the QR code
    commands += "\x1D\x28\x6B\x03\x00\x31\x51\x30";

    // Feed lines
    commands += "\n\n";
  } catch (error) {
    console.error("❌ Alternative QR code failed:", error);
    commands += `QR Code: ${text}\n\n`;
  }

  return commands;
};

// Simple and reliable QR code method
const generateSimpleQRCode = (text) => {
  if (!text) return "";

  let commands = "";

  try {
    console.log("🔳 Generating simple QR code for:", text);

    // Very basic and compatible QR code commands
    commands += "\x1B\x40"; // Initialize

    // QR Code Model - Model 2 is most compatible
    commands += "\x1D\x28\x6B\x04\x00\x31\x41\x32\x00";

    // QR Code Size - Smaller size for better compatibility
    commands += "\x1D\x28\x6B\x03\x00\x31\x43\x04";

    // Error Correction - Level L (7%)
    commands += "\x1D\x28\x6B\x03\x00\x31\x45\x33";

    // Store QR Code Data
    const len = text.length + 3;
    commands +=
      "\x1D\x28\x6B" +
      String.fromCharCode(len % 256) +
      String.fromCharCode(Math.floor(len / 256)) +
      "\x31\x50\x30";
    commands += text;

    // Print QR Code
    commands += "\x1D\x28\x6B\x03\x00\x31\x51\x30";

    // Add some space
    commands += "\n\n";
  } catch (error) {
    console.error("❌ Simple QR code failed:", error);
    // Text fallback
    commands += FONTS.ALIGN_CENTER;
    commands += "══════════════\n";
    commands += `QR: ${text}\n`;
    commands += "══════════════\n\n";
    commands += FONTS.ALIGN_LEFT;
  }

  return commands;
};

// Working QR code method that actually generates the barcode
const generateWorkingQRCode = (text) => {
  if (!text) return "";

  let commands = "";

  try {
    console.log("🔳 Generating WORKING QR code for:", text);

    // This is the most reliable method for thermal printers
    // Using standard ESC/POS QR code commands

    // Initialize printer
    commands += "\x1B\x40";

    // Set QR code model - Model 2 (most compatible)
    // GS ( k pL pH cn fn n
    commands += "\x1D\x28\x6B\x04\x00\x31\x41\x32\x00";

    // Set QR code size - module size (1-16, 3 is small, 6 is medium)
    commands += "\x1D\x28\x6B\x03\x00\x31\x43\x06";

    // Set error correction level - L (7%)
    commands += "\x1D\x28\x6B\x03\x00\x31\x45\x33";

    // Store QR code data
    const data = text;
    const dataLength = data.length + 3;
    const pL = dataLength & 0xff;
    const pH = (dataLength >> 8) & 0xff;

    // GS ( k pL pH cn fn m d1...dk
    commands +=
      "\x1D\x28\x6B" +
      String.fromCharCode(pL) +
      String.fromCharCode(pH) +
      "\x31\x50\x30";
    commands += data;

    // Print QR code
    commands += "\x1D\x28\x6B\x03\x00\x31\x51\x30";

    // Feed some lines after QR code
    commands += "\n\n";

    console.log("✅ WORKING QR code generated successfully");
  } catch (error) {
    console.error("❌ WORKING QR code failed:", error);
    // Create a visual representation of QR code
    commands += FONTS.ALIGN_CENTER;
    commands += "┌──────────────┐\n";
    commands += "│   ██████     │\n";
    commands += "│   ██  ██     │\n";
    commands += "│   ██████     │\n";
    commands += `│   QR: ${text.padEnd(6)}  │\n`;
    commands += "└──────────────┘\n";
    commands += "(Scan this code)\n\n";
    commands += FONTS.ALIGN_LEFT;
  }

  return commands;
};

// Test all QR code methods and use the first one that works
const generateQRCodeWithFallback = (text) => {
  if (!text) return "";

  console.log("🔄 Testing multiple QR code methods for:", text);

  // List of methods to try in order
  const methods = [
    generateWorkingQRCode,
    generateSimpleQRCode,
    generateQRCodeESCPOS,
    generateQRCodeAlternative,
  ];

  for (let i = 0; i < methods.length; i++) {
    try {
      const qrCode = methods[i](text);
      if (qrCode && qrCode.length > 20) {
        // Basic validation
        console.log(`✅ QR Code Method ${i + 1} successful`);
        return qrCode;
      }
    } catch (error) {
      console.log(`❌ QR Code Method ${i + 1} failed:`, error.message);
    }
  }

  // All methods failed - use ultimate fallback
  console.log("⚠️ All QR code methods failed, using text representation");
  let fallback = FONTS.ALIGN_CENTER;
  fallback += "▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n";
  fallback += "█ QR CODE SCAN  █\n";
  fallback += "█                █\n";
  fallback += FONTS.BOLD_ON + `█     ${text}        █\n` + FONTS.BOLD_OFF;
  fallback += "█                █\n";
  fallback += "█  FOR DETAILS   █\n";
  fallback += "▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀\n";
  fallback += FONTS.ALIGN_LEFT;
  fallback += "\n";

  return fallback;
};

// Create a standalone printer service instance
const createPrinterService = (baseUrl) => {
  const API_URL = `${baseUrl}/printers`;

  return {
    // Get Printer By ID
    getPrinterById: async (id) => {
      const response = await axios.get(`${API_URL}/get`, { params: { id } });
      return response.data;
    },

    // Get Printers By Employee ID
    getPrintersByEmployee: async (empId) => {
      const response = await axios.get(`${API_URL}/by-emp`, {
        params: { empId },
      });
      console.log("📦 Printers for employee:", empId, response.data);
      return response.data;
    },

    // Create Printer
    createPrinter: async (printerData) => {
      const response = await axios.post(`${API_URL}/create`, printerData);
      return response.data;
    },

    // Update Printer
    updatePrinter: async (printerData) => {
      const response = await axios.put(`${API_URL}/update`, printerData);
      return response.data;
    },

    // Delete Printer
    deletePrinter: async (id) => {
      const response = await axios.delete(`${API_URL}/delete`, {
        params: { id },
      });
      return response.data;
    },
  };
};

// Fetch estimation data
export const fetchEstimationData = async (estBatchNo, username, apiBaseUrl) => {
  console.log("🔍 fetchEstimationData called with:", {
    estBatchNo,
    apiBaseUrl,
  });

  if (!estBatchNo) {
    Alert.alert("Error", "No Estimation No found for printing.");
    return null;
  }

  if (!apiBaseUrl) {
    Alert.alert("Error", "No API base URL configured.");
    return null;
  }

  try {
    const api = axios.create({
      baseURL: apiBaseUrl,
      timeout: 30000,
    });

    console.log(
      "📡 Making API call to:",
      `${apiBaseUrl}/printDetails/${estBatchNo}`
    );

    const response = await api.get(`/printDetails/${estBatchNo}`);
    console.log("✅ API Response received:", response.status);

    const itemsRaw = Array.isArray(response.data) ? response.data : [];
    console.log("📊 Items raw data length:", itemsRaw.length);

    if (!itemsRaw.length) {
      Alert.alert("Error", "No data found for this Estimation.");
      return null;
    }

    const items = mergeItems(itemsRaw);
    const sample = items[0];
    console.log("📋 Sample item:", sample);

    // Fetch offer via POST
    let offer = { discount: 0, netwt: 0, board_rate: 0 };
    try {
      console.log("📡 Fetching offer data...");
      const offerRes = await api.post("/offer", null, {
        params: { tagno: sample.tagno },
      });
      offer = offerRes.data || offer;
      console.log("✅ Offer data:", offer);
    } catch (err) {
      console.warn("Failed to fetch offer:", err);
    }

    // Fetch today rates
    let goldRate = 0,
      silverRate = 0;
    try {
      console.log("📡 Fetching today rates...");
      const rateRes = await api.get("/todayrate");
      goldRate = rateRes.data?.GOLDRATE || 0;
      silverRate = rateRes.data?.SILVERRATE || 0;
      console.log("✅ Rates - Gold:", goldRate, "Silver:", silverRate);
    } catch (rateError) {
      console.warn("Failed to fetch rates, using sample rates:", rateError);
      goldRate = sample.goldrate || 0;
      silverRate = sample.silverrate || 0;
    }

    const totalpcs = items.reduce((sum, i) => sum + (i.pcs || 0), 0);
    const totalGrossWeight = items.reduce((sum, i) => sum + (i.grswt || 0), 0);
    const baseAmount = items.reduce((sum, i) => sum + (i.amount || 0), 0);

    let cgstAmount = 0;
    let sgstAmount = 0;
    items.forEach((item) => {
      (item.taxes || []).forEach((tax) => {
        const taxId = (tax.tax_id || "").toUpperCase();
        if (taxId === "CG") cgstAmount += tax.tax_amount || 0;
        else if (taxId === "SG") sgstAmount += tax.tax_amount || 0;
      });
    });

    const grandTotal = baseAmount + cgstAmount + sgstAmount;

    console.log("💰 Totals:", {
      totalpcs,
      totalGrossWeight,
      baseAmount,
      cgstAmount,
      sgstAmount,
      grandTotal,
    });

    // Fetch stones for each item
    const fetchStonesForItem = async (itemid, tagno) => {
      try {
        console.log(`📡 Fetching stones for ITEMID=${itemid} TAGNO=${tagno}`);
        const res = await api.get("/stnInputs", {
          params: { itemid, tagno },
          timeout: 15000,
        });
        const stones = Array.isArray(res.data) ? res.data : [];
        console.log(`✅ Found ${stones.length} stones for item`);
        return stones;
      } catch (err) {
        console.warn(
          `Failed to fetch stones for ITEMID=${itemid} TAGNO=${tagno}`,
          err
        );
        return [];
      }
    };

    // Build items with stones
    console.log("🔄 Building items with stones...");
    const itemsWithStones = await Promise.all(
      items.map(async (item) => {
        const stones = await fetchStonesForItem(item.itemid, item.tagno);
        return { ...item, stones };
      })
    );

    const result = {
      items,
      sample,
      goldRate,
      silverRate,
      totalpcs,
      totalGrossWeight,
      baseAmount,
      cgstAmount,
      sgstAmount,
      grandTotal,
      offer,
      itemsWithStones,
    };

    console.log("✅ Successfully built slip data");
    return result;
  } catch (error) {
    console.error("❌ Fetch error details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });

    let errorMessage = "Failed to fetch estimation data.";

    if (error.code === "NETWORK_ERROR") {
      errorMessage =
        "Network error: Please check your internet connection and try again.";
    } else if (error.response) {
      errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = "No response from server. Please try again.";
    }

    Alert.alert("Error", errorMessage);
    return null;
  }
};

// Function to get active printer from API - ENHANCED VERSION
export const getActivePrinter = async (employeeId, apiBaseUrl) => {
  try {
    console.log("🖨️ Fetching printers for employee:", employeeId);

    if (!apiBaseUrl) {
      throw new Error("API base URL is required to fetch printers");
    }

    const printerService = createPrinterService(apiBaseUrl);
    const printers = await printerService.getPrintersByEmployee(employeeId);

    console.log("📦 Printers received from API:", printers);

    if (!printers || printers.length === 0) {
      console.log("❌ No printers found for employee:", employeeId);
      return null; // Return null instead of throwing error
    }

    // Find active printer
    const activePrinter = printers.find((printer) => {
      const activeValue = printer.active;
      const isActive =
        activeValue === true ||
        activeValue === "true" ||
        activeValue === 1 ||
        activeValue === "1" ||
        (typeof activeValue === "string" &&
          activeValue.toLowerCase() === "true") ||
        activeValue === "Y" ||
        activeValue === "y";

      console.log(`🔍 Checking printer "${printer.name}":`, {
        active: activeValue,
        type: typeof activeValue,
        isActive: isActive,
      });

      return isActive;
    });

    if (activePrinter) {
      console.log("✅ ACTIVE PRINTER FOUND:", {
        name: activePrinter.name,
        ip: activePrinter.ip_address,
        port: activePrinter.port,
        active: activePrinter.active,
        id: activePrinter.id,
      });
      return activePrinter;
    } else {
      console.log("ℹ️ No active printer found. User needs to set one.");
      return null; // Return null instead of throwing error
    }
  } catch (error) {
    console.error("❌ Error in getActivePrinter:", error);
    return null; // Return null on error instead of throwing
  }
};

// Function to check printer connectivity
export const checkPrinterConnection = async (
  printer = null,
  employeeId = null,
  apiBaseUrl = null
) => {
  try {
    console.log("🔍 Starting printer connectivity check...");

    let activePrinter = printer;

    if (!activePrinter && employeeId && apiBaseUrl) {
      console.log(
        "🔄 No printer provided, fetching active printer for employee:",
        employeeId
      );
      activePrinter = await getActivePrinter(employeeId, apiBaseUrl);
    }

    if (!activePrinter) {
      console.log("❌ No printer configured for connectivity check");
      return {
        connected: false,
        error: "No printer configured",
      };
    }

    const options = {
      port: activePrinter.port || 9100,
      host: activePrinter.ip_address,
      reuseAddress: true,
      timeout: 5000,
    };

    console.log(
      `🔍 Checking printer connection: ${activePrinter.ip_address}:${activePrinter.port}`
    );

    return new Promise((resolve) => {
      console.log("🔄 Creating TCP connection for printer check...");

      const client = TcpSocket.createConnection(options, () => {
        console.log("✅ Printer connection successful - printer is online");
        client.destroy();
        resolve({
          connected: true,
          printer: activePrinter,
          message: "Printer is connected and reachable",
        });
      });

      client.on("error", (error) => {
        console.log("❌ Printer connection error:", error.message);
        client.destroy();
        resolve({
          connected: false,
          printer: activePrinter,
          error: error.message || "Failed to connect to printer",
        });
      });

      client.on("timeout", () => {
        console.log("⏰ Printer connection timeout - printer may be offline");
        client.destroy();
        resolve({
          connected: false,
          printer: activePrinter,
          error: "Connection timeout - printer may be offline",
        });
      });

      // Set a fallback timeout
      setTimeout(() => {
        if (client && client.writable) {
          console.log("⏰ Fallback timeout reached for printer check");
          client.destroy();
          resolve({
            connected: false,
            printer: activePrinter,
            error: "Connection check timeout",
          });
        }
      }, 6000);
    });
  } catch (error) {
    console.error("❌ Printer check setup error:", error);
    return {
      connected: false,
      error: error.message || "Failed to check printer connection",
    };
  }
};

// Print estimation to printer - COMPLETE VERSION WITH WORKING QR CODE
export const printEstimationToPrinter = async (
  slipData,
  currentPrinter = null,
  employeeId = null,
  apiBaseUrl = null
) => {
  try {
    console.log("🖨️ Starting print process...");

    // Get active printer - either from parameter or from API
    let activePrinter = currentPrinter;

    if (!activePrinter && employeeId && apiBaseUrl) {
      console.log(
        "🔄 No printer provided, fetching active printer for employee:",
        employeeId
      );
      activePrinter = await getActivePrinter(employeeId, apiBaseUrl);
    }

    // Check if we have an active printer
    if (!activePrinter) {
      console.log("❌ No active printer selected - stopping print process");
      throw new Error(
        "No active printer selected. Please select a printer in Printer Settings."
      );
    }

    // Additional check: verify the printer is actually marked as active
    if (
      !(
        activePrinter.active === true ||
        activePrinter.active === "true" ||
        activePrinter.active === 1
      )
    ) {
      console.log("❌ Printer is not marked as active:", activePrinter);
      throw new Error(
        "Selected printer is not active. Please set a current printer in Printer Settings."
      );
    }

    // Check printer connectivity before printing
    console.log("🔍 Checking printer connectivity before printing...");
    const connectivityStatus = await checkPrinterConnection(activePrinter);

    if (!connectivityStatus.connected) {
      console.log("❌ Printer is not connected, aborting print");
      throw new Error(`Printer is offline: ${connectivityStatus.error}`);
    }

    console.log("✅ Printer is connected, proceeding with print...");

    const options = {
      port: activePrinter.port || 9100,
      host: activePrinter.ip_address,
      reuseAddress: true,
      timeout: 10000,
    };

    console.log(
      `🖨️ Printing to: ${activePrinter.ip_address}:${activePrinter.port}`
    );

    const {
      items,
      sample,
      goldRate,
      silverRate,
      totalpcs,
      totalGrossWeight,
      baseAmount,
      cgstAmount,
      sgstAmount,
      grandTotal,
      offer,
      itemsWithStones,
    } = slipData;

    return new Promise((resolve, reject) => {
      console.log("🔄 Creating TCP connection for printing...");

      const client = TcpSocket.createConnection(options, () => {
        console.log("✅ Connected to printer:", activePrinter.ip_address);

        const offerWeight = offer.netwt || 0;
        const offerBoardRate = offer.board_rate || 0;
        const offerDiscount = offerWeight * offerBoardRate;
        const trandate =
          sample?.trandate && sample.trandate.includes("-")
            ? sample.trandate
            : formatDate(sample?.trandate);

        // Build the print content with styling
        let printContent = FONTS.ALIGN_CENTER;

        // Initialize printer
        printContent += PRINTER_COMMANDS.INIT;

        // Header Section with styling
        printContent += FONTS.ALIGN_CENTER;
        printContent += FONTS.BOLD_ON + FONTS.DOUBLE_HEIGHT;
        printContent += "ESTIMATION SLIP\n";
        printContent += FONTS.BOLD_OFF + FONTS.NORMAL;

        printContent += formatStyledLine(
          "NAME :",
          "_____________________________",
          FONTS.BOLD_ON
        );
        printContent += "\n";
        printContent += formatStyledLine(
          "MOBILE :",
          "_____________________________",
          FONTS.BOLD_ON
        );
        printContent += "\n";
        printContent += "-----------------------------------------\n";

        // Estimation Info
        printContent += formatStyledLine(
          "ESTIMATION SLIP",
          `Est.No: ${sample?.tranno || ""} - ${"BMG"}`,
          FONTS.BOLD_ON
        );
        printContent += formatStyledLine(
          `Date: ${trandate}`,
          `Gold: ${goldRate.toFixed(0)}/Gm`
        );
        printContent += formatStyledLine(
          `Time: ${getCurrentTime()}`,
          `Silver: ${silverRate.toFixed(2)}/Gm`
        );
        printContent += "-----------------------------------------\n";

        // Table Header with bold
        printContent += formatStyledLine(
          "Description",
          "Weight    V.A    Amount",
          FONTS.BOLD_ON
        );
        printContent += "-----------------------------------------\n";

        // Items List - formatted to match preview
        itemsWithStones.forEach((item, idx) => {
          const itemName = (item.itemname || "").toUpperCase();
          const itemNumber = idx + 1;
          const stones = item.stones || [];

          // Main item row with bold

          const indent = "    "; // 4 spaces, tweak as needed

          printContent += formatStyledLine(
            `${indent}${itemNumber} ${itemName} (${item.pcs} Pcs) [${item.itemid}-${item.tagno}]`,
            "",
            FONTS.BOLD_ON,
            FONTS.ALIGN_LEFT
          );

          printContent += formatStyledLine(
            `Rate:${silverRate.toFixed(0)} `,
            `${(item.grswt || 0).toFixed(3)}    ${
              item.wastper && item.wastper > 0 ? item.wastper.toFixed(1) : ""
            }    ${(item.amount || 0).toFixed(0)}`
          );

          // Net weight if different
          if (item.grswt !== item.netwt) {
            printContent += formatStyledLine(
              "Netwt:",
              `${(item.netwt || 0).toFixed(3)}`
            );
          }

          // Stones
          stones.forEach((stone) => {
            printContent += formatStyledLine(
              "STUDDED",
              `${stone.stnwt?.toFixed(3) || "0.000"}${
                stone.stoneunit || ""
              }        ${stone.stnamt?.toFixed(0) || "0"}`
            );
          });

          // Subitem names
          stones.forEach((stone) => {
            if (item.subitemname) {
              printContent += formatStyledLine(
                item.subitemname?.toUpperCase() || "",
                ""
              );
            }
          });
        });

        // Totals Section
        printContent += "-----------------------------------------\n";
        printContent += formatStyledLine(
          `Tot.Pcs: ${totalpcs}`,
          `${totalGrossWeight.toFixed(3)}        ${baseAmount.toFixed(0)}`,
          FONTS.BOLD_ON
        );

        if (offerDiscount > 0) {
          printContent += formatStyledLine(
            `Offer (${offerWeight.toFixed(3)} * ${offerBoardRate})`,
            `${offerDiscount.toFixed(1)}`
          );
        }

        printContent += formatStyledLine(
          "CGST (1.5%)",
          `${cgstAmount.toFixed(0)}`
        );
        printContent += formatStyledLine(
          "SGST (1.5%)",
          `${sgstAmount.toFixed(0)}`
        );
        printContent += "-----------------------------------------\n";

        // Grand Total with large font
        printContent += FONTS.BOLD_ON + FONTS.DOUBLE_HEIGHT;
        printContent += formatStyledLine(
          "Sales TOTAL:",
          `${grandTotal.toFixed(0)}`
        );
        printContent += FONTS.NORMAL;

        printContent += "-----------------------------------------\n";

        // --- QR CODE SECTION (clean + centered + minimal spacing) ---
        printContent += "\n"; // small top gap
        printContent += FONTS.ALIGN_CENTER; // ensure QR is centered

        const estNo = sample?.tranno || "NA";
        console.log("Printing QR Code for Estimation No:", estNo);

        // QR (centered)
        printContent += `Est.No: ${estNo}\n`;
        printContent += printQRCode(estNo);

        printContent += PRINTER_COMMANDS.FEED_LINES(3);
        printContent += PRINTER_COMMANDS.CUT;

        console.log("📝 Sending print data to printer...");
        console.log("📄 Print content length:", printContent.length);

        // Write data with error handling
        try {
          client.write(printContent, "binary", (error) => {
            if (error) {
              console.log("❌ Write error:", error);
              reject(error);
              return;
            }

            console.log("✅ Print data sent successfully");
            // Wait a bit before closing to ensure data is sent
            setTimeout(() => {
              client.destroy();
              console.log("✅ Print completed successfully");
              resolve();
            }, 1000);
          });
        } catch (error) {
          console.log("❌ Write exception:", error);
          client.destroy();
          reject(error);
        }
      });

      client.on("error", (error) => {
        console.log("❌ Printer connection error during print:", error);
        client.destroy();
        reject(error);
      });

      client.on("close", () => {
        console.log("🔌 Printer connection closed");
      });

      client.on("timeout", () => {
        console.log("⏰ Printer connection timeout during print");
        client.destroy();
        reject(new Error("Connection timeout"));
      });

      // Set a global timeout for the entire print operation
      setTimeout(() => {
        if (client && client.writable) {
          console.log("⏰ Overall print operation timeout");
          client.destroy();
          reject(new Error("Print operation timeout"));
        }
      }, 15000);
    });
  } catch (error) {
    console.error("❌ Print setup error:", error);
    throw error;
  }
};

// Export all functions
export default {
  formatDate,
  getCurrentTime,
  mergeItems,
  fetchEstimationData,
  printEstimationToPrinter,
  getActivePrinter,
  checkPrinterConnection,
  createPrinterService,
  generateQRCodeESCPOS,
  generateWorkingQRCode,
  generateQRCodeWithFallback,
};
