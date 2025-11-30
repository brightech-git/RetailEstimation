import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "../../../Context/ThemeContext";
import { createEstimationPreviewModalStyles } from "./EstimationPreviewModalStyles";
import { MaterialIcons } from "@expo/vector-icons";

// Common utility functions
export const formatDateSafe = (dateString) => {
  if (!dateString) return "";

  // If already in DD-MM-YYYY, return as is
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return dateString;
  }

  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
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
    baseAmount,
    cgstAmount,
    sgstAmount,
    grandTotal,
    offer,
    itemsWithStones,
  } = slipData;

  const offerWeight = offer.netwt || 0;
  const offerBoardRate = offer.board_rate || 0;
  const offerDiscount = offerWeight * offerBoardRate;

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

    onPrint();
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

  // Show only printer status when not connected
  if (!printerStatus.connected && !printerStatus.checking) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Estimation Slip Preview</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialIcons
                  name="close"
                  size={24}
                  color={theme.COLORS.text}
                />
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
                <Text style={styles.statusDescription}>
                  {currentPrinter
                    ? "Printer is offline or not reachable"
                    : "No printer configured for your account"}
                </Text>
              </View>
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
            </View>

            {/* Error State Content */}
            <View style={styles.errorStateContainer}>
              <MaterialIcons
                name="print-disabled"
                size={80}
                color={theme.COLORS.textLight}
                style={styles.errorIcon}
              />

              <Text style={styles.errorTitle}>
                {currentPrinter
                  ? "Printer Connection Issue"
                  : "Printer Not Configured"}
              </Text>

              <Text style={styles.errorDescription}>
                {currentPrinter
                  ? `Unable to connect to "${currentPrinter.name}". Please check the printer configuration and network connection.`
                  : "You need to set up a printer before you can print estimation slips."}
              </Text>

              {currentPrinter && (
                <View style={styles.printerDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons
                      name="dns"
                      size={16}
                      color={theme.COLORS.textLight}
                    />
                    <Text style={styles.detailText}>
                      {currentPrinter.ip_address}:{currentPrinter.port}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons
                      name="wifi"
                      size={16}
                      color={theme.COLORS.textLight}
                    />
                    <Text style={styles.detailText}>
                      Network: {currentPrinter.ip_address.split(".")[0]}.x.x.x
                    </Text>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {currentPrinter && (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={onCheckConnection}
                  >
                    <MaterialIcons
                      name="wifi-tethering"
                      size={18}
                      color={theme.COLORS.primary}
                    />
                    <Text style={styles.secondaryButtonText}>
                      Check Connection
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSetupPrinter}
                >
                  <MaterialIcons
                    name={currentPrinter ? "settings" : "add"}
                    size={18}
                    color={theme.COLORS.buttonText}
                  />
                  <Text style={styles.primaryButtonText}>
                    {currentPrinter ? "Change Printer" : "Setup Printer"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Preview */}
            <View style={styles.quickPreview}>
              <Text style={styles.previewTitle}>Slip Preview</Text>
              <View style={styles.previewContent}>
                <Text style={styles.previewText}>
                  Est.No: {sample?.tranno || ""} • Items: {items.length}
                </Text>
                <Text style={styles.previewText}>
                  Total: ₹{grandTotal.toFixed(0)} • Pcs: {totalpcs}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Show full preview when printer is connected or checking
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
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
                Est.No: {sample?.tranno || ""} - {"BMG"}
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
            {itemsWithStones.map((item, idx) => {
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
                    <Text style={[styles.text, styles.colDesc]}>Rate</Text>
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
                      <Text style={[styles.text, styles.colAmount]}>
                        {stone.stnamt?.toFixed(0) || "0"}
                      </Text>
                    </View>
                  ))}

                  {/* MC */}
                  {/* {item.mcgrm && (
                    <View style={styles.itemRow}>
                      <Text style={[styles.text, styles.colDesc]}>MC PER GRAM:</Text>
                      <Text style={[styles.text, styles.colAmount]}>
                        {item.mcgrm?.toFixed(0)}
                      </Text>
                    </View>
                  )}
                  {item.mcharge && (
                    <View style={styles.itemRow}>
                      <Text style={[styles.text, styles.colDesc]}>MC TOTAL:</Text>
                      <Text style={[styles.text, styles.colAmount]}>
                        {item.mcharge?.toFixed(0)}
                      </Text>
                    </View>
                  )} */}

                  {/* Subitem Names */}
                  {stones.map((stone, stoneIdx) =>
                    item.subitemname ? (
                      <View key={`subitem-${stoneIdx}`} style={styles.itemRow}>
                        <Text style={[styles.text, styles.colDesc]}>
                          {item.subitemname?.toUpperCase() || ""}
                        </Text>
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
                <Text style={[styles.boldText, styles.colAmount]}>
                  {baseAmount.toFixed(0)}
                </Text>
              </View>

              {offerDiscount > 0 && (
                <View style={styles.row}>
                  <Text style={[styles.text, styles.colDesc]}>
                    Offer ({offerWeight.toFixed(3)} * {offerBoardRate})
                  </Text>
                  <Text style={[styles.text, styles.colAmount]}>
                    {offerDiscount.toFixed(1)}
                  </Text>
                </View>
              )}

              <View style={styles.row}>
                <Text style={[styles.text, styles.colDesc]}>CGST (1.5%)</Text>
                <Text style={[styles.text, styles.colAmount]}>
                  {cgstAmount.toFixed(0)}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.text, styles.colDesc]}>SGST (1.5%)</Text>
                <Text style={[styles.text, styles.colAmount]}>
                  {sgstAmount.toFixed(0)}
                </Text>
              </View>

              <View style={styles.dashedLine} />

              <View style={styles.grandTotalRow}>
                <Text style={[styles.grandTotalText, styles.colDesc]}>
                  Sales TOTAL:
                </Text>
                <Text style={[styles.grandTotalText, styles.colAmount]}>
                  {grandTotal.toFixed(0)}
                </Text>
              </View>

              <View style={styles.dashedLine} />

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.boldText}>[SFH]</Text>
                <Text style={styles.text}>Est.No: {sample?.tranno || ""}</Text>
              </View>
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
              disabled={!printerStatus.connected || printerStatus.checking}
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
                    {printerStatus.connected ? "Print Now" : "Setup Printer"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EstimationPreviewModal;
