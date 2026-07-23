// Phase 4 – Shared Components
// Reusable surface container using theme color, radius, border and shadow.
import React from "react";
import { View } from "react-native";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { CardProps } from "./types";

const styles = makeStyles(theme);

export const Card: React.FC<CardProps> = ({
  children,
  padded = true,
  shadow = "sm",
  style,
}) => {
  return (
    <View style={[styles.base, padded && styles.padded, theme.shadow[shadow], style]}>
      {children}
    </View>
  );
};

export default Card;
