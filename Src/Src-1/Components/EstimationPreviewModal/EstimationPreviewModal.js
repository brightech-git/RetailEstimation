import React, { useState, useContext, useMemo, useCallback, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { useTheme } from "../../../Context/ThemeContext";
import { createEstimationPreviewModalStyles } from "./EstimationPreviewModalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { LoginContext } from "../../../Context/LoginContext";
import { buildHtml } from "../../../Utills/buildReceiptHtml";
import { buildHtml2 } from "../../../Utills/buildReceiptHtml2";
import { formatDate, getCurrentTime } from "../../Service/EstimationPrinterService";
import {
  getOfferBoardRate,
  calcDisplayTotals,
  splitInclusiveGst,
} from "../../../shared/EstimationCalculations";
import useEmployeeDisplay from "../../Hook/useEmployeeDisplay";
import { useApiBaseUrl } from "../../../Config/Config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const formatDateSafe = (dateString) => {
  if (!dateString) return "";
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) return dateString;
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  return `${String(date.getDate()).padStart(2,"0")}-${String(date.getMonth()+1).padStart(2,"0")}-${date.getFullYear()}`;
};

// Preview Modal Component for Estimation Slip
const EstimationPreviewModal = ({
  visible,
  onClose,
  onPrint,
  slipData,
  currentPrinter,
  printerStatus,
  onCheckConnection,
  onRefreshPrinter,
  navigation,
  offerPrintGst = "N",
  estTabPrint = "N",
}) => {
  const { theme } = useTheme();
  const styles = createEstimationPreviewModalStyles(theme);
  const insets = useSafeAreaInsets();
  const [printCount, setPrintCount] = useState(1);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [customPrintCount, setCustomPrintCount] = useState("");
  const { username, companyName, selectedCostId, userId } = useContext(LoginContext);
  const API_BASE_URL = useApiBaseUrl();
  const empDisplay = useEmployeeDisplay(
    API_BASE_URL,
    selectedCostId ? slipData?.sample?.empid : null,
  );

  useEffect(() => {
    console.log('🖨️ EstimationPreviewModal - estTabPrint:', estTabPrint);
  }, [estTabPrint]);

  const [previewWidth, setPreviewWidth] = useState(
    Math.round(Dimensions.get("window").width * 0.95) - 32
  );
  const onPreviewLayout = useCallback((e) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w > 0) setPreviewWidth(w);
  }, []);

  const previewHtml = useMemo(() => {
    if (!slipData) return null;
    const { items, sample, goldRate, silverRate, totalpcs, totalGrossWeight,
      grossAmount, baseAmount, offerDiscount,
      offerName, itemsWithStones, discountTaxAmount, purchaseItems } = slipData;

    // Same rule as the actual printed receipt (buildReceiptImageParams):
    // offer line + GST-inclusive split only when OFFERPRINTGST is 'Y';
    // when 'N', GST/grand total are computed on the full pre-discount
    // amount instead of the discounted one.
    const offerSplit =
      offerPrintGst === "Y" && offerDiscount > 0
        ? splitInclusiveGst(offerDiscount)
        : null;
    const displayTotals = calcDisplayTotals({ baseAmount, grossAmount }, offerPrintGst);

    const params = {
      companyName,
      costId: selectedCostId || "",
      empDisplay,
      estNo: sample?.tranno || "NA",
      billDate: formatDateSafe(sample?.trandate),
      billTime: getCurrentTime(),
      goldRate,
      silverRate,
      userId,
      items: (itemsWithStones || items || []).map((item) => ({
        itemid: item.itemid, tagno: item.tagno, itemname: item.itemname,
        pcs: item.pcs, grswt: item.grswt, netwt: item.netwt,
        wastper: item.wastper, wastage: item.wastage, mcharge: item.mcharge,
        amount: item.amount, displayAmount: item.displayAmount,
        rate: item.rate,
        // debug
        ...(console.log('[PreviewItem] wastage:', item.wastage, '| mcharge:', item.mcharge) || {}),
        stones: (item.stones || []).map((s) => ({ stnwt: s.stnwt, stnamt: s.stnamt, stoneunit: s.stoneunit })),
      })),
      boardRate: getOfferBoardRate(slipData.offer),
      offerNetwt: slipData.offer?.netwt || 0,
      offerPrintGst,
      totals: {
        totalpcs,
        totalGrossWeight,
        grossAmount,
        baseAmount,
        offerDiscount,
        offerName,
        cgstAmount: displayTotals.cgstAmount,
        sgstAmount: displayTotals.sgstAmount,
        grandTotal: displayTotals.grandTotal,
        offerExclGst: offerSplit?.exclGst ?? null,
        offerGstEach: offerSplit?.gstEach ?? null,
        discountTaxAmount,
      },
      purchaseItems: (purchaseItems || []).map((p) => ({
        itemname: p.itemname || "",
        pcs:      p.pcs      || 0,
        grswt:    p.grswt    || 0,
        netwt:    p.netwt    || 0,
        dustwt:   p.dustwt   || 0,
        wastper:  p.wastper  || 0,
        wastage:  p.wastage  || 0,
        rate:     p.rate     || 0,
        amount:   p.amount   || 0,
        flag:     p.flag     || "",
        purexch:  p.purexch  || "",
        purity:   p.purity   || 0,
      })),
    };
    return estTabPrint === 'Y' ? buildHtml2(params, previewWidth) : buildHtml(params, previewWidth);
  }, [slipData, companyName, selectedCostId, previewWidth, empDisplay, offerPrintGst, estTabPrint]);

  if (!slipData) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                Estimation Slip Preview
              </Text>
            <View style={styles.errorContainer}>
              <MaterialIcons
                name="error-outline"
                size={48}
                color={theme.COLORS.danger}
              />
              <Text style={styles.errorText}>No slip data available</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const getPrinterStatusDisplay = () => {
    if (printerStatus.checking) {
      return {
        text: "Checking printer connection...",
        color: theme.COLORS.warning,
        icon: "🔄",
        status: "checking",
      };
    }

    if (printerStatus.connected && currentPrinter) {
      return {
        text: `Connected to ${currentPrinter.name}`,
        color: theme.COLORS.success,
        icon: "✅",
        status: "connected",
      };
    }

    if (currentPrinter) {
      return {
        text: `Offline - ${currentPrinter.name}`,
        color: theme.COLORS.danger,
        icon: "❌",
        status: "offline",
      };
    }

    return {
      text: "No printer configured",
      color: theme.COLORS.textLight,
      icon: "⚙️",
      status: "not_configured",
    };
  };

  const statusDisplay = getPrinterStatusDisplay();

  const handlePrintPress = () => {
    if (printerStatus.checking) {
      return;
    }

    if (!printerStatus.connected) {
      Alert.alert(
        "Printer Not Ready",
        currentPrinter
          ? `Cannot connect to "${currentPrinter.name}". Please check the connection.`
          : "No printer configured. Please set up a printer first.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Setup Printer",
            onPress: () => {
              onClose();
              setTimeout(() => {
                navigation.navigate("Print");
              }, 300);
            },
          },
        ]
      );
      return;
    }

    // Pass print count to onPrint function
    onPrint(printCount);
  };

  const handleSetupPrinter = () => {
    onClose();
    setTimeout(() => {
      navigation.navigate("Print");
    }, 300);
  };

  const handleRefreshPrinter = () => {
    if (onRefreshPrinter) {
      onRefreshPrinter();
    }
  };

  // Calculate rate value for display
  const getRateValue = (item) => {
    return item.salemode === "R"
      ? (item.amount || 0).toFixed(0)
      : (parseFloat(item.boardrate) || 0).toFixed(0);
  };

  // Handle print count selection
  const handlePrintCountSelect = (count) => {
    setPrintCount(count);
    setShowPrintOptions(false);
  };

  const handleCustomPrintCount = () => {
    const count = parseInt(customPrintCount, 10);
    if (!isNaN(count) && count > 0 && count <= 50) { // Limit to 50 copies
      setPrintCount(count);
      setCustomPrintCount("");
      setShowPrintOptions(false);
    } else {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid number between 1 and 50",
        [{ text: "OK" }]
      );
    }
  };

  // Close dropdown when clicking outside
  const handleCloseDropdown = () => {
    if (showPrintOptions) {
      setShowPrintOptions(false);
    }
  };

  // Show full preview always (print button disabled when not connected)
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleCloseDropdown}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Estimation Slip Preview</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialIcons name="close" size={24} color={theme.COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Printer Status Display */}
            <View style={styles.printerStatusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: statusDisplay.color },
                ]}
              />
              <View style={styles.statusTextContainer}>
                <Text
                  style={[
                    styles.printerStatusText,
                    { color: statusDisplay.color },
                  ]}
                >
                  {statusDisplay.text}
                </Text>
                {currentPrinter && (
                  <Text style={styles.printerInfo} numberOfLines={1}>
                    {currentPrinter.ip_address}:{currentPrinter.port}
                  </Text>
                )}
              </View>

              {printerStatus.checking ? (
                <ActivityIndicator
                  size="small"
                  color={statusDisplay.color}
                  style={styles.loadingIndicator}
                />
              ) : (
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={handleRefreshPrinter}
                >
                  <MaterialIcons
                    name="refresh"
                    size={20}
                    color={theme.COLORS.primary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Print Count Selector */}
            <View style={styles.printCountContainer}>
              <Text style={styles.printCountLabel}>Print Copies:</Text>
              
              <TouchableOpacity 
                style={styles.printCountSelector}
                onPress={() => setShowPrintOptions(!showPrintOptions)}
              >
                <Text style={styles.printCountText}>{printCount}</Text>
                <MaterialIcons
                  name={showPrintOptions ? "arrow-drop-up" : "arrow-drop-down"}
                  size={24}
                  color={theme.COLORS.primary}
                />
              </TouchableOpacity>

              {showPrintOptions && (
                <View style={styles.printOptionsDropdown}>
                  {[1, 2, 3, 4, 5].map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={[
                        styles.printOption,
                        printCount === count && styles.printOptionSelected
                      ]}
                      onPress={() => handlePrintCountSelect(count)}
                    >
                      <Text style={[
                        styles.printOptionText,
                        printCount === count && styles.printOptionTextSelected
                      ]}>
                        {count} {count === 1 ? 'copy' : 'copies'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  
                  {/* Custom Input Option */}
                  <View style={styles.customPrintContainer}>
                    <TextInput
                      style={styles.customPrintInput}
                      placeholder="Enter number"
                      keyboardType="numeric"
                      value={customPrintCount}
                      onChangeText={setCustomPrintCount}
                      maxLength={3}
                    />
                    <TouchableOpacity 
                      style={styles.customPrintButton}
                      onPress={handleCustomPrintCount}
                    >
                      <MaterialIcons
                        name="done"
                        size={18}
                        color={theme.COLORS.buttonText}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Full Slip Preview — same HTML as print */}
            <View style={styles.previewContainer} onLayout={onPreviewLayout}>
              <WebView
                source={{ html: previewHtml || "<html><body></body></html>" }}
                style={styles.previewWebView}
                originWhitelist={["*"]}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                javaScriptEnabled
                domStorageEnabled
              />
            </View>

            {/* Action Buttons */}
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <MaterialIcons
                  name="close"
                  size={18}
                  color={theme.COLORS.buttonText}
                />
                <Text style={styles.buttonText} numberOfLines={1}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.printButton,
                  (!printerStatus.connected || printerStatus.checking) &&
                    styles.printButtonDisabled,
                ]}
                onPress={handlePrintPress}
              >
                {printerStatus.checking ? (
                  <ActivityIndicator size="small" color={theme.COLORS.buttonText} />
                ) : (
                  <>
                    <MaterialIcons
                      name="print"
                      size={18}
                      color={theme.COLORS.buttonText}
                    />
                    <Text style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                      {printerStatus.connected ? `Print (${printCount})` : "Setup Printer"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EstimationPreviewModal;