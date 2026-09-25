import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CommonHeader from "../../../Components/Header/CommonHeader";
import Footer from "../../../Components/Footer/Footer";
import ReturnRefModal from "../../Components/SalesReturn/ReturnRefModal/ReturnRefModal";
import SaleReturnBillsModal from "../../Components/SalesReturn/SaleReturnBillsModal/SaleReturnBillsModal";
import { useApiBaseUrl } from "../../../Config/Config";
import { useTheme } from "../../../Context/ThemeContext";
import { createHomeStyles } from "../Home/HomeStyles";
import { useSalesReturn } from "../../Hook/UseSalesReturn";

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
  const navigation = useNavigation();

  const salesReturn = useSalesReturn(API_BASE_URL, {
    onExit: () => navigation.goBack(),
  });
  const { returnRef } = salesReturn;

  return (
    <>
      <CommonHeader
        title="Sales Return"
        subtitle={
          returnRef
            ? returnRef.billNo
              ? returnRef.billDate
                ? `Bill No: ${returnRef.billNo} · ${returnRef.billDate}`
                : `Bill No: ${returnRef.billNo}`
              : `Bill Date: ${returnRef.billDate}`
            : undefined
        }
        rightIcon="calendar-outline"
        onRightPress={salesReturn.openRefModal}
      />

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Loading Indicator */}
          {salesReturn.loading && (
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

              {salesReturn.rows.map((item, rowIdx) => (
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
                      {salesReturn.calcRowGross(item).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.cell}>
                      {salesReturn.calcRowGST(item).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.cell}>
                      {salesReturn.calcRowTotal(item).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.cell}>{item.EMP}</Text>
                  </View>
                  <View style={styles.deleteCol}>
                    <TouchableOpacity
                      onPress={() => salesReturn.removeRow(rowIdx)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Totals Display */}
          {salesReturn.hasData && (
            <View style={styles.totalsContainer}>
              <Text style={styles.totalsSectionLabel}>Sales Return</Text>
              <View style={styles.totalsRow}>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel} numberOfLines={1}>Gross Amt</Text>
                  <Text style={styles.totalValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>₹{salesReturn.totalGross.toFixed(2)}</Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel} numberOfLines={1}>GST Amt</Text>
                  <Text style={styles.totalValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>₹{salesReturn.totalGST.toFixed(2)}</Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel} numberOfLines={1}>Total Amt</Text>
                  <Text style={[styles.totalValue, styles.grandTotal]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>₹{salesReturn.totalGrand.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          {salesReturn.hasData && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.submitButton, styles.clearButton]}
                onPress={salesReturn.clearAll}
              >
                <Text style={styles.submitButtonText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </ScrollView>
      <Footer />

      <ReturnRefModal
        visible={salesReturn.refModalVisible}
        onClose={salesReturn.handleRefClose}
        onDone={salesReturn.handleRefDone}
      />

      <SaleReturnBillsModal
        visible={salesReturn.billsModalVisible}
        billDate={returnRef?.billDate}
        bills={salesReturn.bills}
        required={!salesReturn.hasData}
        loading={salesReturn.loading}
        onClose={salesReturn.handleBillsClose}
        onSelect={salesReturn.handleBillSelect}
      />
    </>
  );
};

export default SalesReturnScreen;
