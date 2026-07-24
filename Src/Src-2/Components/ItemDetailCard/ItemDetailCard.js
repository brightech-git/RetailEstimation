import React from "react";
import { View, Text } from "react-native";
import { createItemDetailsStyles } from "./ItemDetailsStyles";

const ItemDetailsCard = ({ item, index, theme }) => {
  const styles = createItemDetailsStyles(theme);

  const grossAmount = parseFloat(item.GrossAmount) || 0;  // original gross from API
  const discount = parseFloat(item.DISCOUNT) || 0;
  const taxableAmount = grossAmount - discount;             // gross after discount
  const gstPer = parseFloat(item.GSTPer) || 3;             // 1.5% CGST + 1.5% SGST
  const gstAmount = parseFloat(((taxableAmount * gstPer) / 100).toFixed(2));
  const grandTotal = parseFloat((taxableAmount + gstAmount).toFixed(2));
  const GRSWT = parseFloat(item.GRSWT) || 0;

  // Function to get fallback icon based on item name or type
  const getFallbackIcon = () => {
    const itemName = (item.ITEMNAME || "").toLowerCase();
    
    if (itemName.includes("ring")) return "💍";
    if (itemName.includes("necklace")) return "📿";
    if (itemName.includes("bracelet")) return "📿";
    if (itemName.includes("earring")) return "✨";
    if (itemName.includes("chain")) return "⛓️";
    if (itemName.includes("bangle")) return "⭕";
    if (itemName.includes("pendant")) return "✨";
    if (itemName.includes("diamond")) return "💎";
    if (itemName.includes("gold")) return "🥇";
    if (itemName.includes("silver")) return "🥈";
    if (itemName.includes("platinum")) return "🔗";
    
    // Based on price range
    if (grandTotal > 100000) return "💎";
    if (grandTotal > 50000) return "✨";
    if (grandTotal > 10000) return "🔶";
    
    return "💍"; // Default icon
  };

  // Function to get background color based on item
  const getBackgroundColor = () => {
    const itemName = (item.ITEMNAME || "").toLowerCase();
    
    if (itemName.includes("gold")) return theme.COLORS.warning + "20";
    if (itemName.includes("diamond")) return theme.COLORS.info + "20";
    if (itemName.includes("silver")) return theme.COLORS.gray + "20";
    if (itemName.includes("platinum")) return theme.COLORS.primary + "20";
    
    return theme.COLORS.lightGray;
  };

  return (
    <View key={`item-${index}`} style={styles.itemCard}>
      <View style={styles.cardImageContainer}>
        <View style={[
          styles.imagePlaceholder,
          { backgroundColor: getBackgroundColor() }
        ]}>
          <Text style={styles.imagePlaceholderIcon}>{getFallbackIcon()}</Text>
          {item.PCS > 1 && (
            <View style={styles.piecesBadge}>
              <Text style={styles.piecesText}>{item.PCS}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardTagSection}>
        <Text style={styles.cardTagNumber}>
          {item.ITEMID || "N/A"}-{item.TAGNO || "N/A"}
        </Text>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardDetailsSection}>
        <View style={styles.cardDetailRow}>
          <Text style={styles.cardDetailLabel}>Item Name</Text>
          <Text style={styles.cardDetailValue}>{item.ITEMNAME || "N/A"}</Text>
        </View>

        {item.SUBITEMNAME && (
          <View style={styles.cardDetailRow}>
            <Text style={styles.cardDetailLabel}>Sub Item Name</Text>
            <Text style={styles.cardDetailValue}>{item.SUBITEMNAME}</Text>
          </View>
        )}

        <View style={styles.cardDetailRow}>
          <Text style={styles.cardDetailLabel}>Pieces</Text>
          <Text style={styles.cardDetailValue}>{item.PCS || "0"}</Text>
        </View>

        <View style={styles.cardDetailRow}>
          <Text style={styles.cardDetailLabel}>Gross Weight</Text>
          <Text style={styles.cardDetailValue}>{GRSWT.toFixed(2)} Grams</Text>
        </View>

        <View style={styles.cardDetailRow}>
          <Text style={styles.cardDetailLabel}>Gross Amount</Text>
          <Text style={styles.cardDetailValue}>₹ {grossAmount.toFixed(2)}</Text>
        </View>

        {discount > 0 && (
          <>
            <View style={styles.cardDetailRow}>
              <Text style={styles.cardDetailLabel}>Discount</Text>
              <Text style={styles.cardDetailValue}>₹ {discount.toFixed(2)}</Text>
            </View>
            <View style={styles.cardDetailRow}>
              <Text style={styles.cardDetailLabel}>After Discount</Text>
              <Text style={styles.cardDetailValue}>₹ {taxableAmount.toFixed(2)}</Text>
            </View>
          </>
        )}

        <View style={styles.cardDetailRow}>
          <Text style={styles.cardDetailLabel}>GST Amount</Text>
          <Text style={styles.cardDetailValue}>₹ {gstAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.cardDivider} />
        <View style={[styles.cardDetailRow, styles.cardGrandTotalRow]}>
          <Text style={styles.cardGrandTotalLabel}>Grand Total</Text>
          <Text style={styles.cardGrandTotalValue}>
            ₹ {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ItemDetailsCard;
