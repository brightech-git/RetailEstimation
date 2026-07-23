// Phase 7 – Estimation Components
// Horizontal estimation grid. Replaces the inline table in HomeScreen. Same
// 16 columns in the same order, same values (raw fields + the three calculated
// columns via the passed-in calculation helpers), and the same delete action.
// Structure improved by driving columns from a config instead of repeating JSX.
import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { EstimationTableProps, EstimationRow } from "./types";

const styles = makeStyles(theme);

type CalcHelpers = {
  gross: (row: EstimationRow) => number;
  gst: (row: EstimationRow) => number;
  grand: (row: EstimationRow) => number;
};

const COLUMNS: { label: string; get: (row: EstimationRow, calc: CalcHelpers) => unknown }[] = [
  { label: "Item ID", get: (r) => r.ITEMID },
  { label: "Tag No", get: (r) => r.TAGNO },
  { label: "Pcs", get: (r) => r.PCS },
  { label: "Grswt", get: (r) => r.GRSWT },
  { label: "NetWt", get: (r) => r.NETWT },
  { label: "Rate", get: (r) => r.Rate },
  { label: "Wastage", get: (r) => r.Wastage },
  { label: "MC", get: (r) => r.MC },
  { label: "Stone", get: (r) => r.StoneAmount },
  { label: "Misc", get: (r) => r.MiscAmount },
  { label: "Gross", get: (r, c) => c.gross(r).toFixed(2) },
  { label: "GST", get: (r, c) => c.gst(r).toFixed(2) },
  { label: "GrandTotal", get: (r, c) => c.grand(r).toFixed(2) },
  { label: "Emp", get: (r) => r.EMP },
  { label: "CostID", get: (r) => r.COSTID },
  { label: "CompanyID", get: (r) => r.COMPANYID },
];

export const EstimationTable: React.FC<EstimationTableProps> = ({
  data,
  onRemoveRow,
  calculateGrossAmount,
  calculateGST,
  calculateGrandTotal,
}) => {
  const calc: CalcHelpers = {
    gross: calculateGrossAmount,
    gst: calculateGST,
    grand: calculateGrandTotal,
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator style={styles.container}>
      <View>
        {/* Header */}
        <View style={styles.headerRow}>
          {COLUMNS.map((col, idx) => (
            <View key={`header-${idx}`} style={styles.column}>
              <Text style={styles.headerCell}>{col.label}</Text>
            </View>
          ))}
          <View style={styles.deleteCol}>
            <Text style={styles.headerCell}>Delete</Text>
          </View>
        </View>

        {/* Rows */}
        {data.map((item, rowIdx) => (
          <View key={`data-${rowIdx}`} style={styles.dataRow}>
            {COLUMNS.map((col, colIdx) => (
              <View key={`cell-${rowIdx}-${colIdx}`} style={styles.column}>
                <Text style={styles.cell}>{col.get(item, calc) as React.ReactNode}</Text>
              </View>
            ))}
            <View style={styles.deleteCol}>
              <TouchableOpacity onPress={() => onRemoveRow(rowIdx)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default EstimationTable;
