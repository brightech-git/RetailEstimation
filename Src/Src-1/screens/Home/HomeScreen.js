import React, { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import MainHeader from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import BarcodeScannerModal from "../../Components/BarCodeScanner/BarcodeScannerModal";
import {
  printEstimationSlip,
  useEstimationPreview,
} from "../../Components/PrintReceipt/PrintSlip";
import { useApiBaseUrl } from "../../../Config/Config";
import { useTheme } from "../../../Context/ThemeContext";
import { createHomeStyles } from "./HomeStyles";
import { useEstimation } from "../../Hook/UseEstimation";
import { LoginContext } from "../../../Context/LoginContext";
import { TotalsCard, EstimationTable } from "@modules/estimation/components";
import { logger } from "@core/logger";

const HomeScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const styles = createHomeStyles(theme);
  const API_BASE_URL = useApiBaseUrl();
  const { username } = useContext(LoginContext);

  // Check if EstimationPreviewComponent is a valid React element
  const estimationPreview = useEstimationPreview();
  const EstimationPreviewComponent =
    estimationPreview?.EstimationPreviewComponent || null;

  const estimation = useEstimation(API_BASE_URL);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    if (!service) return;

    setRefreshing(true);

    try {
      const updatedTable = await Promise.all(
        tableData.map(async (row) => {
          try {
            const data = await service.fetchEstimationData(
              row.ITEMID,
              row.TAGNO
            );
            if (!Array.isArray(data) || data.length === 0) return row; // no new data

            const firstItem = data[0];
            const costId = firstItem.COSTID || "";
            const companyId = firstItem.COMPANYID || "";

            // Merge new data into the existing row
            return {
              ...row,
              ...data[0],
              COSTID: costId,
              COMPANYID: companyId,
              EMPID: row.EMPID,
              EMP: row.EMP,
            };
          } catch (e) {
            logger.debug("Error refreshing row:", row, e);
            return row; // keep old row if error
          }
        })
      );

      setTableData(updatedTable);
    } catch (err) {
      logger.debug("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePrint = async () => {
    logger.debug("🖨️ Print button clicked, estBatchNo:", estimation.estBatchNo);
    logger.debug("👤 Username:", username);
    logger.debug("🌐 API Base URL:", API_BASE_URL);

    if (!estimation.estBatchNo) {
      Alert.alert(
        "No slip available",
        "Please submit first to generate a slip"
      );
      return;
    }

    if (!API_BASE_URL) {
      Alert.alert("Configuration Error", "API base URL is not configured");
      return;
    }

    try {
      logger.debug("📞 Calling printEstimationSlip...");
      await printEstimationSlip(estimation.estBatchNo, username, API_BASE_URL);
    } catch (err) {
      logger.error("❌ Print error:", err);
      Alert.alert("Print Failed", err.message || "Unable to generate slip");
    }
  };

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MainHeader />
        <View style={styles.container}>
          {/* Totals Display */}
          {estimation.tableData.length > 0 && (
            <TotalsCard
              gross={estimation.totalGross}
              gst={estimation.totalGST}
              grand={estimation.totalGrand}
            />
          )}

          {/* Input Fields */}
          {/* Input Fields */}
          <View style={styles.inputRow}>
            <View style={[styles.inputWrapper, styles.itemIdWrapper]}>
              <TextInput
                ref={estimation.itemIdInputRef}
                style={styles.input}
                placeholder="Item ID"
                placeholderTextColor={theme.COLORS.placeholder}
                value={estimation.ITEMID}
                onChangeText={(text) => {
                  estimation.setITEMID(text);
                  estimation.setShowList(false);
                }}
                onSubmitEditing={() => {
                  if (estimation.ITEMID.trim() === "")
                    estimation.fetchItemList();
                  else estimation.tagInputRef.current?.focus();
                }}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => {
                  estimation.setScanningField("itemid");
                  estimation.setScannerVisible(true);
                }}
                style={styles.scanButton}
              >
                <Text style={styles.scanIcon}>📷</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputWrapper, styles.tagNoWrapper]}>
              <TextInput
                ref={estimation.tagInputRef}
                style={styles.input}
                placeholder="Tag No"
                placeholderTextColor={theme.COLORS.placeholder}
                value={estimation.TAGNO}
                onChangeText={estimation.setTAGNO}
                onSubmitEditing={() => estimation.empInputRef.current?.focus()}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => {
                  estimation.setScanningField("tagno");
                  estimation.setScannerVisible(true);
                }}
                style={styles.scanButton}
              >
                <Text style={styles.scanIcon}>📷</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputWrapper, styles.empIdWrapper]}>
              <TextInput
                ref={estimation.empInputRef}
                style={styles.input}
                placeholder="ID"
                placeholderTextColor={theme.COLORS.placeholder}
                value={estimation.emp}
                onChangeText={estimation.setEmp}
                onSubmitEditing={estimation.fetchData}
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Item Suggestions Dropdown */}
          {estimation.showList && estimation.itemList.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={estimation.itemList}
                keyExtractor={(item, index) => `item-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      estimation.setITEMID(item);
                      estimation.setShowList(false);
                      estimation.tagInputRef.current?.focus();
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                )}
                nestedScrollEnabled={true}
              />
            </View>
          )}

          {/* Loading Indicator */}
          {estimation.loading && (
            <ActivityIndicator
              size="large"
              color={theme.COLORS.primary}
              style={styles.loader}
            />
          )}

          {/* Data Table */}
          {estimation.tableData.length > 0 && (
            <EstimationTable
              data={estimation.tableData}
              onRemoveRow={estimation.removeRow}
              calculateGrossAmount={estimation.calculateGrossAmount}
              calculateGST={estimation.calculateGST}
              calculateGrandTotal={estimation.calculateGrandTotal}
            />
          )}

          {/* Transaction Number Display */}
          {estimation.tranno && (
            <View style={styles.trannoContainer}>
              <Text style={styles.trannoText}>
                Last Submitted TRANNO: {estimation.tranno}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                estimation.loading && styles.disabledButton,
              ]}
              onPress={async () => {
                const batchNo = await estimation.submitData();
                if (batchNo) {
                  estimation.setEstBatchNo(batchNo);
                  logger.debug("ESTBATCHNO:", batchNo);
                }
              }}
              disabled={estimation.loading}
            >
              <Text style={styles.submitButtonText}>
                {estimation.loading ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                styles.printButton,
                !estimation.estBatchNo && styles.disabledButton,
              ]}
              onPress={handlePrint}
              disabled={!estimation.estBatchNo}
            >
              <Text style={styles.submitButtonText}>Print Slip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, styles.clearButton]}
              onPress={estimation.clearAll}
            >
              <Text style={styles.submitButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Scanner Modal */}
          <BarcodeScannerModal
            visible={estimation.scannerVisible}
            onClose={() => estimation.setScannerVisible(false)}
            scanningField={estimation.scanningField}
            onScanned={estimation.handleScanned}
          />

          {/* Print Preview Component - Only render if valid */}
          {EstimationPreviewComponent &&
            React.isValidElement(EstimationPreviewComponent) &&
            EstimationPreviewComponent}
        </View>
      </ScrollView>
      <Footer />
    </>
  );
};

export default HomeScreen;
