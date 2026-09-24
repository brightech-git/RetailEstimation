import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import CommonHeader from "../../../Components/Header/CommonHeader";
import Footer from "../../Components/Footer/Footer";
import BarcodeScannerModal from "../../Components/BarCodeScanner/BarcodeScannerModal";
import ReturnRefModal from "../../Components/SalesReturn/ReturnRefModal/ReturnRefModal";
import { useApiBaseUrl } from "../../../Config/Config";
import { useTheme } from "../../../Context/ThemeContext";
import { createHomeStyles } from "../Home/HomeStyles";
import { useEstimation } from "../../Hook/UseEstimation";

const TABLE_COLUMNS = [
  { label: "Item Id", key: "ITEMID" },
  { label: "Tag No", key: "TAGNO" },
  { label: "Pcs", key: "PCS" },
  { label: "Grswt", key: "GRSWT" },
  { label: "NetWt", key: "NETWT" },
  { label: "Rate", key: "RATE" },
  { label: "Wastage", key: "WASTAGE" },
  { label: "Mc", key: "MC" },
  { label: "StoneAmt", key: "StoneAmount" },
  { label: "Gross Amt", key: "GROSS" },
  { label: "GST", key: "GST" },
  { label: "Amount", key: "AMOUNT" },
  { label: "Emp", key: "EMP" },
];

const SalesReturnScreen = () => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const API_BASE_URL = useApiBaseUrl();

  const estimation = useEstimation(API_BASE_URL);

  // Shown once when the screen opens, to pick how this return is referenced.
  const [refModalVisible, setRefModalVisible] = useState(true);
  const [returnRef, setReturnRef] = useState(null);

  const handleRefDone = (selection) => {
    setReturnRef(selection);
    setRefModalVisible(false);
  };

  return (
    <>
      <CommonHeader
        title="Sales Return"
        subtitle={
          returnRef
            ? returnRef.mode === "date"
              ? `Bill Date: ${returnRef.billDate}`
              : returnRef.billNo
                ? `Bill No: ${returnRef.billNo}`
                : "By Bill No"
            : undefined
        }
        rightIcon="calendar-outline"
        onRightPress={() => setRefModalVisible(true)}
      />

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
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
                onChangeText={(text) => estimation.setEmp(text)}
                onSubmitEditing={() => {
                  estimation.setShowEmpList(false);
                  estimation.fetchData();
                }}
                returnKeyType="done"
              />
              {!!estimation.empName && (
                <Text style={styles.empNameText} numberOfLines={1}>{estimation.empName}</Text>
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

          {/* Return Items Table */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={styles.tableContainer}
          >
            <View>
              <View style={styles.headerRow}>
                {TABLE_COLUMNS.map((col, idx) => (
                  <View key={`header-${idx}`} style={styles.column}>
                    <Text style={styles.headerCell} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{col.label}</Text>
                  </View>
                ))}
                <View style={styles.deleteCol}>
                  <Text style={styles.headerCell} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>Delete</Text>
                </View>
              </View>

              {estimation.tableData.map((item, rowIdx) => (
                <View key={`data-${rowIdx}`} style={styles.dataRow}>
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
                    <Text style={styles.cell}>
                      {estimation.calculateDiscountedGross(item).toFixed(2)}
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

          {/* Action Buttons */}
          {estimation.tableData.length > 0 && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.submitButton, styles.clearButton]}
                onPress={estimation.clearAll}
              >
                <Text style={styles.submitButtonText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Scanner Modal */}
          <BarcodeScannerModal
            visible={estimation.scannerVisible}
            onClose={() => estimation.setScannerVisible(false)}
            scanningField={estimation.scanningField}
            onScanned={estimation.handleScanned}
          />
        </View>
      </ScrollView>
      <Footer />

      <ReturnRefModal
        visible={refModalVisible}
        onClose={() => setRefModalVisible(false)}
        onDone={handleRefDone}
      />
    </>
  );
};

export default SalesReturnScreen;
