import TcpSocket from "react-native-tcp-socket";
import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FONTS, PRINTER_COMMANDS } from "../Utills/Themedata";
import createApiInstance from "../../Api/axiosInstance";
import ENDPOINTS from "../../Api/endpoints";

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

// Helper function to format text with styling
const formatStyledLine = (
  leftText,
  rightText,
  style = FONTS.NORMAL,
  align = FONTS.ALIGN_CENTER,
  totalWidth = 40
) => {
  const left = leftText || "";
  const right = rightText || "";

  const paddedLeft = " ".repeat(2) + left;
  let line = align + style + paddedLeft;

  if (right) {
    const spacesNeeded = totalWidth - paddedLeft.length - right.length;
    const spaces = spacesNeeded > 0 ? " ".repeat(spacesNeeded) : " ";
    line += spaces + right;
  }

  if (!right && align === FONTS.ALIGN_LEFT) {
    line = align + style + paddedLeft;
  }

  return line + FONTS.NORMAL + FONTS.ALIGN_LEFT + "\n";
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

export const createPrinterService = (baseUrl) => {
  const api = createApiInstance(baseUrl);

  return {
    getPrinterById: async (id) => {
      try {
        const response = await api.get(ENDPOINTS.PRINTER_GET, { params: { id } });
        return response.data;
      } catch (error) {
        console.error("❌ Error getting printer by ID:", error);
        throw error;
      }
    },

    getPrintersByEmployee: async (empId) => {
      try {
        const response = await api.get(ENDPOINTS.PRINTER_BY_EMP, { params: { empId } });
        console.log("📦 Printers for employee:", empId, response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Error getting printers by employee:", error);
        throw error;
      }
    },

    createPrinter: async (printerData) => {
      try {
        const response = await api.post(ENDPOINTS.PRINTER_CREATE, printerData);
        return response.data;
      } catch (error) {
        console.error("❌ Error creating printer:", error);
        throw error;
      }
    },

    updatePrinter: async (printerData) => {
      try {
        const response = await api.put(ENDPOINTS.PRINTER_UPDATE, printerData);
        return response.data;
      } catch (error) {
        console.error("❌ Error updating printer:", error);
        throw error;
      }
    },

    deletePrinter: async (id) => {
      try {
        const response = await api.delete(ENDPOINTS.PRINTER_DELETE, { params: { id } });
        return response.data;
      } catch (error) {
        console.error("❌ Error deleting printer:", error);
        throw error;
      }
    },
  };
};

export const fetchEstimationData = async (estBatchNo, apiBaseUrl) => {
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
    const api = createApiInstance(apiBaseUrl);
    api.defaults.timeout = 30000;

    console.log("📡 Making API call to:", `${apiBaseUrl}${ENDPOINTS.PRINT_DETAILS(estBatchNo)}`);
    const response = await api.get(ENDPOINTS.PRINT_DETAILS(estBatchNo));
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

    // Fetch offer once (same offer applies to all items)
    let offer = { discount: 0, netwt: 0, board_rate: 0 };
    let offerName = "";
    try {
      console.log("📡 Fetching offer data...");
      const offerRes = await api.post(ENDPOINTS.OFFER, null, {
        params: { tagno: sample.tagno },
      });
      offer = offerRes.data || offer;
      console.log("✅ Offer data:", offer);

      // estBatchNo format: EBSFH2769 → costId=EB, companyId=SFH
      const batchMatch = estBatchNo.match(/^([A-Z]{2})([A-Z]+)\d+$/);
      const costId = batchMatch?.[1] || "";
      const companyId = batchMatch?.[2] || "";
      const offerNameRes = await api.get(ENDPOINTS.OFFER_NAME, {
        params: { companyId, costId },
      });
      offerName = offerNameRes.data || "";
      console.log("✅ Offer name:", offerName);
    } catch (err) {
      console.warn("Failed to fetch offer:", err);
    }

    // Fetch today rates
    let goldRate = 0, silverRate = 0;
    try {
      console.log("📡 Fetching today rates...");
      const rateRes = await api.get(ENDPOINTS.TODAY_RATE);
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

    // const { username, companyName, companyLogo, companyLogoUrl } =
    //   useContext(LoginContext);

    // Get GST % from items (use first item's tax rates)
    let cgstPer = 1.5;
    let sgstPer = 1.5;
    if (items.length > 0 && items[0].taxes) {
      items[0].taxes.forEach((tax) => {
        const taxId = (tax.tax_id || "").toUpperCase();
        if (taxId === "CG") cgstPer = tax.tax_perc || 1.5;
        else if (taxId === "SG") sgstPer = tax.tax_perc || 1.5;
      });
    }

    const offerDiscount = (offer.netwt || 0) * (offer.board_rate || 0);
    const grossAmount = baseAmount + offerDiscount;  // original before discount
    const taxableAmount = baseAmount;                // already discounted
    const cgstAmount = parseFloat(((taxableAmount * cgstPer) / 100).toFixed(2));
    const sgstAmount = parseFloat(((taxableAmount * sgstPer) / 100).toFixed(2));
    const totalTaxAmount = cgstAmount + sgstAmount;
    const grandTotal = parseFloat((taxableAmount + totalTaxAmount).toFixed(2));

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
        const res = await api.get(ENDPOINTS.STN_INPUTS, {
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
        // Reconstruct pre-discount gross per item for display
        // offerDiscount is for the whole batch; distribute proportionally by amount
        const itemShare = baseAmount > 0 ? (item.amount / baseAmount) * offerDiscount : offerDiscount / items.length;
        return { ...item, stones, displayAmount: item.amount + itemShare };
      })
    );

    const result = {
      items,
      sample,
      goldRate,
      silverRate,
      totalpcs,
      totalGrossWeight,
      grossAmount,
      baseAmount,
      offerDiscount,
      totalWastage,
      totalMcharge,
      cgstAmount,
      sgstAmount,
      totalTaxAmount,
      grandTotal,
      offer,
      offerName,
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

// Function to get active printer from API
export const getActivePrinter = async (employeeId, apiBaseUrl) => {
  try {
    console.log("🖨️ Fetching printers for employee:", employeeId);

    if (!apiBaseUrl) {
      throw new Error("API base URL is required to fetch printers");
    }

    // ✅ FIXED: Properly call createPrinterService (no extra parentheses)
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

// Print estimation to printer
export const printEstimationToPrinter = async (
  slipData,
  currentPrinter = null,
  employeeId = null,
  apiBaseUrl = null
) => {
  try {
    console.log("🖨️ Starting print process...");

    let username = "";
    try {
      const stored = await AsyncStorage.getItem("COMPANY_DATA");
      if (stored) username = JSON.parse(stored)?.USERNAME || "";
    } catch (_) {}

    // Get active printer
    let activePrinter = currentPrinter;

    if (!activePrinter && employeeId && apiBaseUrl) {
      console.log(
        "🔄 No printer provided, fetching active printer for employee:",
        employeeId
      );
      activePrinter = await getActivePrinter(employeeId, apiBaseUrl);
    }

    if (!activePrinter) {
      console.log("❌ No active printer selected - stopping print process");
      throw new Error(
        "No active printer selected. Please select a printer in Printer Settings."
      );
    }

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
      grossAmount,
      baseAmount,
      offerDiscount,
      cgstAmount,
      sgstAmount,
      grandTotal,
      offer,
      offerName,
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

        let printContent = FONTS.ALIGN_CENTER;
        printContent += PRINTER_COMMANDS.INIT;

        // Header Section
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
          `Est.No: ${sample?.tranno || ""} - ${username}`,
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

        // Table Header
        printContent += formatStyledLine(
          "Description",
          "Weight    V.A    Amount",
          FONTS.BOLD_ON
        );
        printContent += "-----------------------------------------\n";

        // Items List
        itemsWithStones.forEach((item, idx) => {
          const itemName = (item.itemname || "").toUpperCase();
          const itemNumber = idx + 1;
          const stones = item.stones || [];

          const indent = "    ";

          printContent += formatStyledLine(
            `${indent}${itemNumber} ${itemName} (${item.pcs} Pcs) [${item.itemid}-${item.tagno}]`,
            "",
            FONTS.BOLD_ON,
            FONTS.ALIGN_LEFT
          );

          const rateValue =
            item.salemode === "R"
              ? (item.amount || 0).toFixed(0)
              : (parseFloat(item.boardrate) || 0).toFixed(0);

          printContent += formatStyledLine(
            `Rate:${rateValue} `,
            `${(item.grswt || 0).toFixed(3)}    ${
              item.wastper && item.wastper > 0 ? item.wastper.toFixed(1) : ""
            }    ${((item.displayAmount ?? item.amount) || 0).toFixed(0)}`
          );

          if (item.grswt !== item.netwt) {
            printContent += formatStyledLine(
              "Netwt:",
              `${(item.netwt || 0).toFixed(3)}`
            );
          }

          stones.forEach((stone) => {
            printContent += formatStyledLine(
              "STUDDED",
              `${stone.stnwt?.toFixed(3) || "0.000"}${
                stone.stoneunit || ""
              }        ${stone.stnamt?.toFixed(0) || "0"}`
            );
          });
        });

        // Totals Section
        printContent += "-----------------------------------------\n";
        printContent += formatStyledLine(
          `Tot.Pcs: ${totalpcs}`,
          `${totalGrossWeight.toFixed(3)}        ${grossAmount.toFixed(0)}`,
          FONTS.BOLD_ON
        );

        if (offerDiscount > 0) {
          const offerWeight = offer.netwt || 0;
          const offerBoardRate = offer.board_rate || 0;
          printContent += formatStyledLine(
            `${offerName}`,
            `(${offerWeight.toFixed(3)}*${offerBoardRate})  ${offerDiscount.toFixed(0)}`
          );
          printContent += formatStyledLine(
            "TOTAL",
            `${baseAmount.toFixed(0)}`,
            FONTS.BOLD_ON
          );
        }

        printContent += formatStyledLine(
          "CGST (1.5%)",
          `${cgstAmount.toFixed(2)}`
        );
        printContent += formatStyledLine(
          "SGST (1.5%)",
          `${sgstAmount.toFixed(2)}`
        );

        printContent += "-----------------------------------------\n";

        // Grand Total
        printContent += FONTS.BOLD_ON + FONTS.DOUBLE_HEIGHT;
        printContent += formatStyledLine(
          "Sales TOTAL:",
          `${grandTotal.toFixed(0)}`
        );
        printContent += FONTS.NORMAL;

        printContent += "-----------------------------------------\n";

        // QR CODE
        printContent += "\n";
        printContent += FONTS.ALIGN_CENTER;

        const estNo = sample?.tranno || "NA";
        console.log("Printing QR Code for Estimation No:", estNo);

        printContent += `Est.No: ${estNo}\n`;
        printContent += printQRCode(estNo);

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
};
