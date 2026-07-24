import React, { useState,useEffect,useContext } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "../../../Context/ThemeContext";
import { createEstimationPreviewModalStyles } from "./EstimationPreviewModalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LoginContext} from '../../../Context/LoginContext'

// Common utility functions
export const formatDateSafe = (dateString) => {
  if (!dateString) return "";

  // If already in DD-MM-YYYY, return as is
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return dateString;
  }

  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-IN", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
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
}) => {
  const { theme } = useTheme();
  const styles = createEstimationPreviewModalStyles(theme);
  const [printCount, setPrintCount] = useState(1);
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [customPrintCount, setCustomPrintCount] = useState("");
  const {
    username,
    companyName,
    companyLogo,
    companyLogoUrl
  } = useContext(LoginContext);

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
            <Text style={styles.modalTitle}>Estimation Slip Preview</Text>
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

  // Use itemsWithStones if available, otherwise fall back to items
  const displayItems = itemsWithStones && itemsWithStones.length > 0 ? itemsWithStones : items;

  const offerWeight = offer.netwt || 0;
  const offerBoardRate = offer.board_rate || 0;

  // Get printer status display
  const getPrinterStatusDisplay = () => {
    if (printerStatus.checking) {
      return {
        text: "Checking printer connection...",
        color: theme.COLORS.warning || "#FFA000",
        icon: "🔄",
        status: "checking",
      };
    }

    if (printerStatus.connected && currentPrinter) {
      return {
        text: `Connected to ${currentPrinter.name}`,
        color: theme.COLORS.success || "#1B9721",
        icon: "✅",
        status: "connected",
      };
    }

    if (currentPrinter) {
      return {
        text: `Offline - ${currentPrinter.name}`,
        color: theme.COLORS.danger || "#C62828",
        icon: "❌",
        status: "offline",
      };
    }

    return {
      text: "No printer configured",
      color: theme.COLORS.textLight || "#4A4A4A",
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
                  <Text style={styles.printerInfo}>
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

            {/* Full Slip Preview */}
            <ScrollView
              style={styles.previewContainer}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.previewContentContainer}
            >
              {/* Header Section */}
              <View style={styles.section}>
                <Text style={styles.label}>NAME</Text>
                <View style={styles.underline} />
                <Text style={styles.label}>MOBILE</Text>
                <View style={styles.underline} />
              </View>

              <View style={styles.dashedLine} />

              {/* Estimation Info */}
              <View style={styles.row}>
                <Text style={styles.boldText}>ESTIMATION SLIP</Text>
                <Text style={styles.boldText}>
                  Est.No: {sample?.tranno || ""} - {username}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.text}>
                  Date: {formatDateSafe(sample?.trandate)}
                </Text>
                <Text style={styles.text}>Gold: {goldRate.toFixed(0)}/Gm</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.text}>Time: {getCurrentTime()}</Text>
                <Text style={styles.text}>
                  Silver: {silverRate.toFixed(2)}/Gm
                </Text>
              </View>

              <View style={styles.dashedLine} />

              {/* Table Header */}
              <View style={[styles.row, styles.tableHeader]}>
                <Text style={[styles.boldText, styles.colDesc]}>Description</Text>
                <Text style={[styles.boldText, styles.colWeight]}>Weight</Text>
                <Text style={[styles.boldText, styles.colVA]}>V.A</Text>
                <Text style={[styles.boldText, styles.colAmount]}>Amount</Text>
              </View>

              <View style={styles.dashedLine} />

              {/* Items List */}
              {displayItems.map((item, idx) => {
                const itemName = (item.itemname || "").toUpperCase();
                const itemNumber = idx + 1;
                const stones = item.stones || [];

                return (
                  <View
                    key={`${item.itemid}-${item.tagno}-${idx}`}
                    style={styles.itemContainer}
                  >
                    {/* Main Item */}
                    <View style={styles.itemRow}>
                      <Text style={[styles.boldText, styles.colDesc]}>
                        {itemNumber} {itemName} ({item.pcs} Pcs) [{item.itemid}-
                        {item.tagno}]
                      </Text>
                    </View>

                    <View style={styles.itemRow}>
                      <Text style={[styles.text, styles.colDesc]}>
                        Rate:{getRateValue(item)}
                      </Text>
                      <Text style={[styles.text, styles.colWeight]}>
                        {item.grswt?.toFixed(3) || "0.000"}
                      </Text>
                      <Text style={[styles.text, styles.colVA]}>
                        {item.wastper && item.wastper > 0
                          ? item.wastper.toFixed(1)
                          : ""}
                      </Text>
                      <Text style={[styles.text, styles.colAmount]}>
                        {item.amount?.toFixed(0) || "0"}
                      </Text>
                    </View>

                    {/* Net Weight */}
                    {item.grswt !== item.netwt && (
                      <View style={styles.itemRow}>
                        <Text style={[styles.text, styles.colDesc]}>Netwt:</Text>
                        <Text style={[styles.text, styles.colWeight]}>
                          {item.netwt?.toFixed(3) || "0.000"}
                        </Text>
                        <Text style={[styles.text, styles.colVA]}></Text>
                        <Text style={[styles.text, styles.colAmount]}></Text>
                      </View>
                    )}

                    {/* Stones */}
                    {stones.map((stone, stoneIdx) => (
                      <View key={`stone-${stoneIdx}`} style={styles.itemRow}>
                        <Text style={[styles.text, styles.colDesc]}>STUDDED</Text>
                        <Text style={[styles.text, styles.colWeight]}>
                          {stone.stnwt?.toFixed(3) || "0.000"}
                          {stone.stoneunit || ""}
                        </Text>
                        <Text style={[styles.text, styles.colVA]}></Text>
                        <Text style={[styles.text, styles.colAmount]}>
                          {stone.stnamt?.toFixed(0) || "0"}
                        </Text>
                      </View>
                    ))}

                    {/* Subitem Names */}
                    {stones.map((stone, stoneIdx) =>
                      item.subitemname ? (
                        <View key={`subitem-${stoneIdx}`} style={styles.itemRow}>
                          <Text style={[styles.text, styles.colDesc]}>
                            {item.subitemname?.toUpperCase() || ""}
                          </Text>
                          <Text style={[styles.text, styles.colWeight]}></Text>
                          <Text style={[styles.text, styles.colVA]}></Text>
                          <Text style={[styles.text, styles.colAmount]}></Text>
                        </View>
                      ) : null
                    )}
                  </View>
                );
              })}

              <View style={styles.dashedLine} />

              {/* Totals Section */}
              <View style={styles.totalsSection}>
                <View style={styles.row}>
                  <Text style={[styles.boldText, styles.colDesc]}>
                    Tot.Pcs: {totalpcs}
                  </Text>
                  <Text style={[styles.boldText, styles.colWeight]}>
                    {totalGrossWeight.toFixed(3)}
                  </Text>
                  <Text style={[styles.text, styles.colVA]}></Text>
                  <Text style={[styles.boldText, styles.colAmount]}>
                    {grossAmount.toFixed(0)}
                  </Text>
                </View>

                {offerDiscount > 0 && (
                  <>
                    <View style={styles.row}>
                      <Text style={[styles.text, styles.colDesc]}>
                        {offerName}
                      </Text>
                      <Text style={[styles.text, styles.colWeight]}>({offerWeight.toFixed(3)}*{offerBoardRate})</Text>
                      <Text style={[styles.text, styles.colVA]}></Text>
                      <Text style={[styles.text, styles.colAmount]}>
                        {offerDiscount.toFixed(0)}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={[styles.boldText, styles.colDesc]}>TOTAL</Text>
                      <Text style={[styles.text, styles.colWeight]}></Text>
                      <Text style={[styles.text, styles.colVA]}></Text>
                      <Text style={[styles.boldText, styles.colAmount]}>
                        {baseAmount.toFixed(0)}
                      </Text>
                    </View>
                  </>
                )}

                <View style={styles.row}>
                  <Text style={[styles.text, styles.colDesc]}>CGST (1.5%)</Text>
                  <Text style={[styles.text, styles.colWeight]}></Text>
                  <Text style={[styles.text, styles.colVA]}></Text>
                  <Text style={[styles.text, styles.colAmount]}>
                    {cgstAmount.toFixed(0)}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={[styles.text, styles.colDesc]}>SGST (1.5%)</Text>
                  <Text style={[styles.text, styles.colWeight]}></Text>
                  <Text style={[styles.text, styles.colVA]}></Text>
                  <Text style={[styles.text, styles.colAmount]}>
                    {sgstAmount.toFixed(0)}
                  </Text>
                </View>

                <View style={styles.dashedLine} />

                <View style={styles.grandTotalRow}>
                  <Text style={[styles.grandTotalText, styles.colDesc]}>
                    Sales TOTAL:
                  </Text>
                  <Text style={[styles.text, styles.colWeight]}></Text>
                  <Text style={[styles.text, styles.colVA]}></Text>
                  <Text style={[styles.grandTotalText, styles.colAmount]}>
                    {grandTotal.toFixed(0)}
                  </Text>
                </View>

                <View style={styles.dashedLine} />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <MaterialIcons
                  name="close"
                  size={18}
                  color={theme.COLORS.buttonText}
                />
                <Text style={styles.buttonText}>Cancel</Text>
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
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <MaterialIcons
                      name="print"
                      size={18}
                      color={theme.COLORS.buttonText}
                    />
                    <Text style={styles.buttonText}>
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