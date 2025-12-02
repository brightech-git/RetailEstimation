import React from "react";
import { View, Text, ScrollView } from "react-native";
import { createTableStyles } from "./EstimationTableStyles";

const EstimationTable = ({ 
  tableData, 
  calculateGrossAmount, 
  calculateGST, 
  calculateGrandTotal,
  theme 
}) => {
  const styles = createTableStyles(theme);

  // Helper function to render individual table cells
  const renderTableData = () => {
    return tableData.map((item, rowIdx) => (
      <View key={`row-${rowIdx}`} style={styles.dataRow}>
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
          {calculateGrossAmount(item).toFixed(2)}
        </Text>
        <Text style={styles.cell}>
          {calculateGST(item).toFixed(2)}
        </Text>
        <Text style={styles.cell}>
          {calculateGrandTotal(item).toFixed(2)}
        </Text>
        <Text style={styles.cell}>{item.EMP ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.COSTID ?? "N/A"}</Text>
        <Text style={styles.cell}>{item.COMPANYID ?? "N/A"}</Text>
      </View>
    ));
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      style={styles.tableContainer}
    >
      <View>
        <View style={styles.headerRow}>
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
            "GST",
            "GrandTotal",
            "Emp",
            "CostID",
            "CompanyID",
          ].map((label, idx) => (
            <Text key={`header-${idx}`} style={styles.headerCell}>
              {label}
            </Text>
          ))}
        </View>
        {renderTableData()}
      </View>
    </ScrollView>
  );
};

export default EstimationTable;