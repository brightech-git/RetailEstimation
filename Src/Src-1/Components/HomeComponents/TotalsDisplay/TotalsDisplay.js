import React from "react";
import { View, Text } from "react-native";
import { createTotalsStyles } from "./TotalsDisplayStyles";

const TotalsDisplay = ({ 
  totalGross, 
  totalGST, 
  totalGrand, 
  theme 
}) => {
  const styles = createTotalsStyles(theme);

  return (
    <View style={styles.totalsContainer}>
      <View style={styles.totalsRow}>
        <View style={styles.totalItem}>
          <Text style={styles.totalLabel}>Gross Amount</Text>
          <Text style={styles.totalValue}>
            ₹{totalGross.toFixed(2)}
          </Text>
        </View>

        <View style={styles.totalItem}>
          <Text style={styles.totalLabel}>GST Amount</Text>
          <Text style={styles.totalValue}>₹{totalGST.toFixed(2)}</Text>
        </View>

        <View style={styles.totalItem}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={[styles.totalValue, styles.grandTotal]}>
            ₹{totalGrand.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TotalsDisplay;