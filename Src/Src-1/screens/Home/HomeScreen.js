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

const HomeScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const styles = createHomeStyles(theme);
  const API_BASE_URL = useApiBaseUrl();
  const { username, selectedCompanyId, selectedCostId } = useContext(LoginContext);

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
            const costId = firstItem.COSTID || selectedCostId || "";
            const companyId = selectedCompanyId || "";

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
            console.log("Error refreshing row:", row, e);
            return row; // keep old row if error
          }
        })
      );

      setTableData(updatedTable);
    } catch (err) {
      console.log("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePrint = async () => {
    console.log("🖨️ Print button clicked, estBatchNo:", estimation.estBatchNo);
    console.log("👤 Username:", username);
    console.log("🌐 API Base URL:", API_BASE_URL);

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
      console.log("📞 Calling printEstimationSlip...");
      await printEstimationSlip(estimation.estBatchNo, username, API_BASE_URL, estimation.lastEmpId);
    } catch (err) {
      console.error("❌ Print error:", err);
      Alert.alert("Print Failed", err.message || "Unable to generate slip");
    }
  };

  // Helper function to render individual table cells
  const renderTableData = () => {
    return estimation.tableData.map((item, rowIdx) => (
      <View key={`row-${rowIdx}`} style={styles.dataRow}>
        {/* 🗑️ DELETE BUTTON (Before ItemID) */}
        <TouchableOpacity
          onPress={() => estimation.removeRow(rowIdx)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>

        <Text style={styles.cell}>{item.ITEMID ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.TAGNO ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.PCS ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.GRSWT ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.NETWT ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.Rate ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.Wastage ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.MC ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.StoneAmount ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.MiscAmount ?? "N/A"}</Text>
        <Text style={styles.cell}>
          {estimation.calculateGrossAmount(item).toFixed(2)}
        </Text>
        <Text style={styles.cell}>
          {estimation.calculateGST(item).toFixed(2)}
        </Text>
        <Text style={styles.cell}>
          {estimation.calculateGrandTotal(item).toFixed(2)}
        </Text>
        <Text style={styles.cell}>{item.EMP ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.COSTID ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.COMPANYID ?? "N/A"}</Text>
      </View>
    ));
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
            <View style={styles.totalsContainer}>
              <View style={styles.totalsRow}>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Gross Amount</Text>
                  <Text style={styles.totalValue}>
                    ₹{estimation.totalGross.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Discount</Text>
                  <Text style={styles.totalValue}>
                    ₹{estimation.totalDiscount.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>GST Amount</Text>
                  <Text style={styles.totalValue}>
                    ₹{estimation.totalGST.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>Grand Total</Text>
                  <Text style={[styles.totalValue, styles.grandTotal]}>
                    ₹{estimation.totalGrand.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
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
                placeholder="Emp ID"
                placeholderTextColor={theme.COLORS.placeholder}
                value={estimation.emp}
                onChangeText={estimation.setEmp}
                onSubmitEditing={estimation.fetchData}
                returnKeyType="done"
              />
              {!!estimation.empName && (
                <Text style={styles.empNameText}>{estimation.empName}</Text>
              )}
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              style={styles.tableContainer}
            >
              <View>
                {/* HEADER ROW */}
                <View style={styles.headerRow}>
                  {/* OTHER HEADERS */}
                  {[
                    "Item ID",
                    "Tag No",
                    "Pcs",
                    "Grswt",
                    "NetWt",
                    "Rate",
                    "Wastage",
                    "MC",
                    "Stone",
                    "Misc",
                    "Gross",
                    "Discount",
                    "GST",
                    "GrandTotal",
                    "Emp",
                    "CostID",
                    "CompanyID",
                  ].map((label, idx) => (
                    <View key={`header-${idx}`} style={styles.column}>
                      <Text style={styles.headerCell}>{label}</Text>
                    </View>
                  ))}
                  {/* DELETE HEADER */}
                  <View style={styles.deleteCol}>
                    <Text style={styles.headerCell}>Delete</Text>
                  </View>
                </View>

                {/* DATA ROWS */}
                {estimation.tableData.map((item, rowIdx) => (
                  <View key={`data-${rowIdx}`} style={styles.dataRow}>
                    {/* DATA CELLS */}
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.ITEMID}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.TAGNO}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.PCS}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.GRSWT}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.NETWT}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.RATE ?? item.Rate}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.WASTAGE ?? item.Wastage}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.MC}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.StoneAmount}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.MiscAmount}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>
                        {estimation.calculateDiscountedGross(item).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>
                        {(parseFloat(item.DISCOUNT) || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>
                        {estimation.calculateDiscountedGST(item).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>
                        {estimation.calculateDiscountedGrandTotal(item).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.EMP}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.COSTID}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.COMPANYID}</Text>
                    </View>
                    {/* DELETE BUTTON CELL */}
                    <View style={styles.deleteCol}>
                      <TouchableOpacity
                        onPress={() => estimation.removeRow(rowIdx)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
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
                  console.log("ESTBATCHNO:", batchNo);
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
