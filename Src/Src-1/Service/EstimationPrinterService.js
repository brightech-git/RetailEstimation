import TcpSocket from "react-native-tcp-socket";
import { Alert, Dimensions } from "react-native";
import axios from "axios";
import { FONTS, PRINTER_COMMANDS, COLORS, SIZES } from "../Utills/Themedata";

const { width } = Dimensions.get("screen");

// Calculate optimal receipt width based on device
const RECEIPT_WIDTH = Math.min(width * 0.9, 384); // Max 384px for thermal printer
const CHARS_PER_LINE = 32; // Standard thermal printer characters per line

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
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
      map.set(key, {
        ...item,
        taxes: [...(item.taxes || [])],
      });
    } else {
      const existing = map.get(key);
      existing.pcs += item.pcs || 0;
      existing.netwt += item.netwt || 0;
      existing.grswt += item.grswt || 0;
      existing.amount += item.amount || 0;
      existing.wastage += item.wastage || 0;
      existing.mcharge += item.mcharge || 0;

      // Merge taxes
      (item.taxes || []).forEach((tax) => {
        const idx = existing.taxes.findIndex((t) => t.tax_id === tax.tax_id);
        if (idx >= 0) {
          existing.taxes[idx].tax_amount += tax.tax_amount || 0;
        } else {
          existing.taxes.push({ ...tax });
        }
      });
    }
  });
  return Array.from(map.values());
};

// ENHANCED: Helper function with better styling options
const formatStyledLine = (
  leftText,
  rightText,
  style = FONTS.NORMAL,
  align = FONTS.ALIGN_LEFT,
  width = CHARS_PER_LINE
) => {
  const left = leftText || "";
  const right = rightText || "";
  
  let line = style + align;
  
  if (align === FONTS.ALIGN_CENTER) {
    const totalLength = left.length + (right ? right.length : 0);
    const padding = Math.max(0, width - totalLength);
    const leftPadding = Math.floor(padding / 2);
    const rightPadding = padding - leftPadding;
    
    line += " ".repeat(leftPadding) + left;
    if (right) {
      line += right + " ".repeat(rightPadding);
    }
  } else if (align === FONTS.ALIGN_RIGHT) {
    const totalLength = left.length + (right ? right.length : 0);
    const padding = Math.max(0, width - totalLength);
    line += " ".repeat(padding) + left + (right || "");
  } else {
    // LEFT ALIGN (default)
    if (right) {
      const spacesNeeded = width - left.length - right.length;
      const spaces = spacesNeeded > 0 ? " ".repeat(spacesNeeded) : " ";
      line += left + spaces + right;
    } else {
      line += left;
    }
  }
  
  return line + FONTS.NORMAL + FONTS.ALIGN_LEFT + "\n";
};

// ENHANCED: Create decorative line
const createDivider = (type = "dashed", length = CHARS_PER_LINE) => {
  const characters = {
    dashed: "-",
    solid: "=",
    star: "*",
    dot: ".",
    line: "─",
  };
  
  const char = characters[type] || "-";
  return char.repeat(length) + "\n";
};

// ENHANCED: Create header section
const createHeaderSection = () => {
  let header = "";
  
  // Company Logo/Name with enhanced styling
  header += FONTS.ALIGN_CENTER + FONTS.DOUBLE_HEIGHT + FONTS.BOLD_ON;
  header += "GOLD JEWELLERS\n";
  header += FONTS.NORMAL + FONTS.BOLD_ON;
  header += FONTS.ALIGN_CENTER + "Premium Jewellery\n";
  header += FONTS.NORMAL;
  
  // Address info
  header += FONTS.ALIGN_CENTER;
  header += "123 Main Street, City\n";
  header += "Phone: +91 9876543210\n";
  header += "GSTIN: 27AAAAA0000A1Z5\n";
  
  // Divider
  header += createDivider("star");
  
  return header;
};

// ENHANCED: Create estimation info section
const createEstimationInfo = (sample, goldRate, silverRate, trandate) => {
  let info = "";
  
  // Title
  info += FONTS.ALIGN_CENTER + FONTS.DOUBLE_HEIGHT + FONTS.BOLD_ON;
  info += "ESTIMATION SLIP\n";
  info += FONTS.NORMAL;
  info += createDivider("dashed");
  
  // Estimation details
  info += formatStyledLine(
    `Est. No: ${sample?.tranno || ""} - BMG`,
    `Date: ${trandate}`,
    FONTS.BOLD_ON
  );
  
  info += formatStyledLine(
    `Tag No: ${sample?.tagno || ""}`,
    `Time: ${getCurrentTime()}`,
    FONTS.NORMAL
  );
  
  info += formatStyledLine(
    `Gold: ₹${goldRate.toFixed(0)}/gm`,
    `Silver: ₹${silverRate.toFixed(2)}/gm`,
    FONTS.BOLD_ON
  );
  
  info += createDivider("dashed");
  
  return info;
};

// ENHANCED: Create customer details section
const createCustomerDetails = () => {
  let details = "";
  
  details += FONTS.BOLD_ON + "CUSTOMER DETAILS\n" + FONTS.NORMAL;
  details += formatStyledLine("Name:", "________________________", FONTS.BOLD_ON);
  details += formatStyledLine("Mobile:", "________________________", FONTS.BOLD_ON);
  details += formatStyledLine("Address:", "________________________", FONTS.BOLD_ON);
  
  details += createDivider("solid");
  
  return details;
};

// ENHANCED: Create items table
const createItemsTable = (itemsWithStones) => {
  let table = "";
  
  // Table header
  table += FONTS.BOLD_ON + FONTS.UNDERLINE_ON;
  table += formatStyledLine("ITEM DESCRIPTION", "WEIGHT    AMOUNT", FONTS.BOLD_ON, FONTS.ALIGN_LEFT);
  table += FONTS.UNDERLINE_OFF;
  table += createDivider("dashed");
  
  // Items
  itemsWithStones.forEach((item, idx) => {
    const itemName = `${idx + 1}. ${(item.itemname || "").toUpperCase()}`;
    const pcsInfo = `(${item.pcs} Pcs)`;
    const itemId = `[${item.itemid}-${item.tagno}]`;
    
    // Main item line
    table += FONTS.BOLD_ON + itemName + " " + pcsInfo + FONTS.NORMAL + "\n";
    table += FONTS.SMALL + "  " + itemId + FONTS.NORMAL + "\n";
    
    // Weight and amount
    const weight = (item.netwt || 0).toFixed(3) + " gm";
    const amount = "₹" + (item.amount || 0).toFixed(0);
    table += formatStyledLine(
      `  Net Weight: ${weight}`,
      `Amount: ${amount}`,
      FONTS.NORMAL
    );
    
    // If gross weight differs
    if (item.grswt !== item.netwt) {
      table += formatStyledLine(
        `  Gross Weight: ${(item.grswt || 0).toFixed(3)} gm`,
        "",
        FONTS.SMALL
      );
    }
    
    // Wastage if any
    if (item.wastper && item.wastper > 0) {
      table += formatStyledLine(
        `  Wastage: ${item.wastper.toFixed(1)}%`,
        `Charge: ₹${(item.wastage || 0).toFixed(0)}`,
        FONTS.SMALL
      );
    }
    
    // Stones if any
    if (item.stones && item.stones.length > 0) {
      table += FONTS.SMALL + "  ✨ STUDDED STONES:\n" + FONTS.NORMAL;
      item.stones.forEach((stone, stoneIdx) => {
        const stoneName = stone.stnname || `Stone ${stoneIdx + 1}`;
        const stoneWeight = `${(stone.stnwt || 0).toFixed(3)}${stone.stoneunit || ""}`;
        const stoneAmount = `₹${(stone.stnamt || 0).toFixed(0)}`;
        
        table += formatStyledLine(
          `    ${stoneName}: ${stoneWeight}`,
          stoneAmount,
          FONTS.SMALL
        );
      });
    }
    
    table += "\n";
  });
  
  table += createDivider("solid");
  
  return table;
};

// ENHANCED: Create totals section
const createTotalsSection = (totals, offer) => {
  let totalsSection = "";
  
  totalsSection += FONTS.BOLD_ON + "TOTAL SUMMARY\n" + FONTS.NORMAL;
  totalsSection += createDivider("dashed");
  
  // Basic totals
  totalsSection += formatStyledLine(
    "Total Pieces:",
    totals.totalpcs.toString(),
    FONTS.BOLD_ON
  );
  
  totalsSection += formatStyledLine(
    "Gross Weight:",
    `${totals.totalGrossWeight.toFixed(3)} gm`,
    FONTS.BOLD_ON
  );
  
  totalsSection += formatStyledLine(
    "Base Amount:",
    `₹${totals.baseAmount.toFixed(0)}`,
    FONTS.BOLD_ON
  );
  
  // Offer if any
  if (offer && offer.netwt && offer.board_rate) {
    const offerDiscount = offer.netwt * offer.board_rate;
    totalsSection += formatStyledLine(
      "Offer Discount:",
      `-₹${offerDiscount.toFixed(0)}`,
      FONTS.SMALL
    );
  }
  
  // Taxes
  totalsSection += formatStyledLine(
    "CGST @1.5%:",
    `₹${totals.cgstAmount.toFixed(2)}`,
    FONTS.NORMAL
  );
  
  totalsSection += formatStyledLine(
    "SGST @1.5%:",
    `₹${totals.sgstAmount.toFixed(2)}`,
    FONTS.NORMAL
  );
  
  totalsSection += createDivider("double");
  
  return totalsSection;
};

// ENHANCED: Create grand total section
const createGrandTotal = (grandTotal) => {
  let grandTotalSection = "";
  
  grandTotalSection += FONTS.ALIGN_CENTER + FONTS.DOUBLE_HEIGHT + FONTS.BOLD_ON;
  grandTotalSection += "GRAND TOTAL\n";
  grandTotalSection += FONTS.NORMAL;
  
  grandTotalSection += FONTS.ALIGN_CENTER + FONTS.DOUBLE_HEIGHT + FONTS.BOLD_ON;
  grandTotalSection += `₹${grandTotal.toFixed(0)}\n`;
  grandTotalSection += FONTS.NORMAL;
  
  grandTotalSection += createDivider("star");
  
  return grandTotalSection;
};

// ENHANCED: Create footer section
const createFooter = (estimationNo) => {
  let footer = "";
  
  footer += FONTS.ALIGN_CENTER + FONTS.SMALL;
  footer += "Thank you for your business!\n";
  footer += "We value your trust\n";
  footer += createDivider("dot");
  
  footer += FONTS.ALIGN_CENTER;
  footer += "Terms & Conditions:\n";
  footer += FONTS.SMALL;
  footer += "• Valid for 30 days\n";
  footer += "• Prices subject to change\n";
  footer += "• GST included\n";
  footer += FONTS.NORMAL;
  
  footer += createDivider("star");
  
  // QR Code
  footer += FONTS.ALIGN_CENTER;
  footer += "Scan for digital copy\n";
  
  const estNo = estimationNo || "NA";
  footer += printQRCode(estNo);
  
  footer += FONTS.ALIGN_CENTER + FONTS.SMALL;
  footer += `Est.No: ${estNo}\n`;
  footer += createDivider("star");
  
  // Final footer
  footer += FONTS.ALIGN_CENTER;
  footer += "Visit us again!\n";
  footer += "www.goldjewellers.com\n\n\n";
  
  return footer;
};

// BEST WORKING QR CODE FOR ALL THERMAL PRINTERS
const printQRCode = (estimationNo) => {
  if (!estimationNo) estimationNo = "NO_EST";

  const data = estimationNo.toString();
  let qr = "";

  qr += "\x1D\x28\x6B\x04\x00\x31\x41\x32\x00";
  qr += "\x1D\x28\x6B\x03\x00\x31\x43\x05";
  qr += "\x1D\x28\x6B\x03\x00\x31\x45\x49";

  const len = data.length + 3;
  const pL = len % 256;
  const pH = Math.floor(len / 256);

  qr +=
    "\x1D\x28\x6B" +
    String.fromCharCode(pL) +
    String.fromCharCode(pH) +
    "\x31\x50\x30" +
    data;

  qr += "\x1D\x28\x6B\x03\x00\x31\x51\x30";

  return qr;
};

// ✅ FIXED: Create a simple function, not an object with methods
export const createPrinterService = (baseUrl) => {
  const API_URL = `${baseUrl}/printers`;
  
  return {
    // Get Printer By ID
    getPrinterById: async (id) => {
      try {
        const response = await axios.get(`${API_URL}/get`, { params: { id } });
        return response.data;
      } catch (error) {
        console.error("❌ Error getting printer by ID:", error);
        throw error;
      }
    },

    // Get Printers By Employee ID
    getPrintersByEmployee: async (empId) => {
      try {
        const response = await axios.get(`${API_URL}/by-emp`, {
          params: { empId },
        });
        console.log("📦 Printers for employee:", empId, response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Error getting printers by employee:", error);
        throw error;
      }
    },

    // Create Printer
    createPrinter: async (printerData) => {
      try {
        const response = await axios.post(`${API_URL}/create`, printerData);
        return response.data;
      } catch (error) {
        console.error("❌ Error creating printer:", error);
        throw error;
      }
    },

    // Update Printer
    updatePrinter: async (printerData) => {
      try {
        const response = await axios.put(`${API_URL}/update`, printerData);
        return response.data;
      } catch (error) {
        console.error("❌ Error updating printer:", error);
        throw error;
      }
    },

    // Delete Printer
    deletePrinter: async (id) => {
      try {
        const response = await axios.delete(`${API_URL}/delete`, {
          params: { id },
        });
        return response.data;
      } catch (error) {
        console.error("❌ Error deleting printer:", error);
        throw error;
      }
    },
  };
};

// Fetch estimation data
export const fetchEstimationData = async (estBatchNo, username, apiBaseUrl) => {
  console.log("🔍 fetchEstimationData called with:", { estBatchNo, apiBaseUrl });

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

    console.log("📡 Making API call to:", `${apiBaseUrl}/printDetails/${estBatchNo}`);
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

    // Fetch offer
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

    // Calculate totals
    const totalpcs = items.reduce((sum, i) => sum + (i.pcs || 0), 0);
    const totalGrossWeight = items.reduce((sum, i) => sum + (i.grswt || 0), 0);
    const baseAmount = items.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalWastage = items.reduce((sum, i) => sum + (i.wastage || 0), 0);
    const totalMcharge = items.reduce((sum, i) => sum + (i.mcharge || 0), 0);

    // Get GST values from FIRST ITEM only
    let cgstAmount = 0;
    let sgstAmount = 0;
    let totalTaxAmount = 0;

    if (items.length > 0 && items[0].taxes) {
      items[0].taxes.forEach((tax) => {
        const taxAmount = tax.tax_amount || 0;
        totalTaxAmount += taxAmount;

        const taxId = (tax.tax_id || "").toUpperCase();
        if (taxId === "CG") {
          cgstAmount += taxAmount;
        } else if (taxId === "SG") {
          sgstAmount += taxAmount;
        } else {
          cgstAmount += taxAmount / 2;
          sgstAmount += taxAmount / 2;
        }
      });
    }

    const grandTotal = baseAmount + totalTaxAmount;

    console.log("💰 Totals:", {
      totalpcs,
      totalGrossWeight,
      baseAmount,
      totalWastage,
      totalMcharge,
      cgstAmount,
      sgstAmount,
      totalTaxAmount,
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
        console.warn(`Failed to fetch stones for ITEMID=${itemid} TAGNO=${tagno}`, err);
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
      totalWastage,
      totalMcharge,
      cgstAmount,
      sgstAmount,
      totalTaxAmount,
      grandTotal,
      offer,
      itemsWithStones,
    };

    console.log("✅ Successfully built slip data with first item GST");
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
      errorMessage = "Network error: Please check your internet connection and try again.";
    } else if (error.response) {
      errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = "No response from server. Please try again.";
    }

    Alert.alert("Error", errorMessage);
    return null;
  }
};

// Function to get active printer from API
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
      return null;
    }

    // Find active printer
    const activePrinter = printers.find((printer) => {
      const activeValue = printer.active;
      const isActive =
        activeValue === true ||
        activeValue === "true" ||
        activeValue === 1 ||
        activeValue === "1" ||
        (typeof activeValue === "string" && activeValue.toLowerCase() === "true") ||
        activeValue === "Y" ||
        activeValue === "y";

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
      return null;
    }
  } catch (error) {
    console.error("❌ Error in getActivePrinter:", error);
    return null;
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
      console.log("🔄 No printer provided, fetching active printer for employee:", employeeId);
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

    console.log(`🔍 Checking printer connection: ${activePrinter.ip_address}:${activePrinter.port}`);

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

// ENHANCED: Print estimation with custom fonts and styles
export const printEstimationToPrinter = async (
  slipData,
  currentPrinter = null,
  employeeId = null,
  apiBaseUrl = null,
  useEnhancedStyle = true // New parameter for enhanced styling
) => {
  try {
    console.log("🖨️ Starting print process with enhanced styling...");

    // Get active printer
    let activePrinter = currentPrinter;

    if (!activePrinter && employeeId && apiBaseUrl) {
      console.log("🔄 No printer provided, fetching active printer for employee:", employeeId);
      activePrinter = await getActivePrinter(employeeId, apiBaseUrl);
    }

    if (!activePrinter) {
      console.log("❌ No active printer selected - stopping print process");
      throw new Error(
        "No active printer selected. Please select a printer in Printer Settings."
      );
    }

    if (!(activePrinter.active === true || activePrinter.active === "true" || activePrinter.active === 1)) {
      console.log("❌ Printer is not marked as active:", activePrinter);
      throw new Error(
        "Selected printer is not active. Please set a current printer in Printer Settings."
      );
    }

    // Check printer connectivity
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

    console.log(`🖨️ Printing to: ${activePrinter.ip_address}:${activePrinter.port}`);

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

        const trandate = sample?.trandate && sample.trandate.includes("-")
          ? sample.trandate
          : formatDate(sample?.trandate);

        let printContent = PRINTER_COMMANDS.INIT;
        
        if (useEnhancedStyle) {
          // ENHANCED STYLING
          printContent += createHeaderSection();
          printContent += createEstimationInfo(sample, goldRate, silverRate, trandate);
          printContent += createCustomerDetails();
          printContent += createItemsTable(itemsWithStones);
          printContent += createTotalsSection({
            totalpcs,
            totalGrossWeight,
            baseAmount,
            cgstAmount,
            sgstAmount,
            grandTotal,
          }, offer);
          printContent += createGrandTotal(grandTotal);
          printContent += createFooter(sample?.tranno);
        } else {
          // ORIGINAL STYLING (for backward compatibility)
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

          // ... rest of original formatting
        }

        // Feed and cut
        printContent += PRINTER_COMMANDS.FEED_LINES(3);
        printContent += PRINTER_COMMANDS.CUT;

        console.log("📝 Sending print data to printer...");

        try {
          client.write(printContent, "binary", (error) => {
            if (error) {
              console.log("❌ Write error:", error);
              reject(error);
              return;
            }

            console.log("✅ Print data sent successfully");
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

// NEW: Function to preview receipt styling
export const previewReceiptStyling = (slipData) => {
  if (!slipData) return null;
  
  const { sample, goldRate, silverRate, itemsWithStones, totalpcs, totalGrossWeight, 
          baseAmount, cgstAmount, sgstAmount, grandTotal, offer } = slipData;
  
  const trandate = sample?.trandate && sample.trandate.includes("-")
    ? sample.trandate
    : formatDate(sample?.trandate);
  
  return {
    header: createHeaderSection(),
    estimationInfo: createEstimationInfo(sample, goldRate, silverRate, trandate),
    customerDetails: createCustomerDetails(),
    itemsTable: createItemsTable(itemsWithStones),
    totals: createTotalsSection({
      totalpcs,
      totalGrossWeight,
      baseAmount,
      cgstAmount,
      sgstAmount,
      grandTotal,
    }, offer),
    grandTotal: createGrandTotal(grandTotal),
    footer: createFooter(sample?.tranno),
  };
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
  previewReceiptStyling, // NEW
};