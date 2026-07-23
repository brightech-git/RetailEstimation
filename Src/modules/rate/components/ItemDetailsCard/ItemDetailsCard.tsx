// Phase 8 – Rate Components
// Migrated from Src-2/Components/ItemDetailCard. Same display logic, values and
// formatting; detail lines use the rate InfoRow; styling via @design.
import React from "react";
import { View, Text } from "react-native";
import { theme } from "@design";
import { InfoRow } from "../InfoRow";
import { makeStyles } from "./styles";
import type { ItemDetailsCardProps } from "./types";

const styles = makeStyles(theme);

export const ItemDetailsCard: React.FC<ItemDetailsCardProps> = ({ item }) => {
  const grossAmount = parseFloat(item.GrossAmount as string) || 0;
  const gstAmount = parseFloat(item.GSTAmount as string) || 0;
  const grandTotal = parseFloat(item.GrandTotal as string) || 0;
  const GRSWT = parseFloat(item.GRSWT as string) || 0;

  // Fallback icon based on item name / price range (unchanged logic).
  const getFallbackIcon = (): string => {
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
    if (grandTotal > 100000) return "💎";
    if (grandTotal > 50000) return "✨";
    if (grandTotal > 10000) return "🔶";
    return "💍";
  };

  // Background tint based on item name (mapped to design tokens).
  const getBackgroundColor = (): string => {
    const itemName = (item.ITEMNAME || "").toLowerCase();
    if (itemName.includes("gold")) return theme.colors.warning + "20";
    if (itemName.includes("diamond")) return theme.colors.info + "20";
    if (itemName.includes("silver")) return theme.colors.textSecondary + "20";
    if (itemName.includes("platinum")) return theme.colors.primary + "20";
    return theme.colors.surface;
  };

  const pcs = Number(item.PCS) || 0;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <View style={[styles.imagePlaceholder, { backgroundColor: getBackgroundColor() }]}>
          <Text style={styles.imagePlaceholderIcon}>{getFallbackIcon()}</Text>
          {pcs > 1 && (
            <View style={styles.piecesBadge}>
              <Text style={styles.piecesText}>{String(item.PCS)}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.tagSection}>
        <Text style={styles.tagNumber}>
          {item.ITEMID || "N/A"}-{item.TAGNO || "N/A"}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsSection}>
        <InfoRow label="Item Name" value={item.ITEMNAME || "N/A"} />
        {item.SUBITEMNAME ? (
          <InfoRow label="Sub Item Name" value={item.SUBITEMNAME} />
        ) : null}
        <InfoRow label="Pieces" value={String(item.PCS || "0")} />
        <InfoRow label="Gross Weight" value={`${GRSWT.toFixed(2)} Grams`} />
        <InfoRow label="Gross Amount" value={`₹ ${grossAmount.toFixed(2)}`} />
        <InfoRow label="GST Amount" value={`₹ ${gstAmount.toFixed(2)}`} />
        <InfoRow
          label="Grand Total"
          value={`₹ ${grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`}
          emphasized
        />
      </View>
    </View>
  );
};

export default ItemDetailsCard;
