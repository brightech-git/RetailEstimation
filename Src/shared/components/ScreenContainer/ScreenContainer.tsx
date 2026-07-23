// Phase 4 – Shared Components
// Standard screen wrapper: safe area + themed background + optional padding
// and keyboard avoidance. UI only.
import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { ScreenContainerProps } from "./types";

const styles = makeStyles(theme);

const DEFAULT_EDGES = ["top", "bottom", "left", "right"] as const;

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  padded = true,
  backgroundColor = theme.colors.background,
  keyboardAvoiding = false,
  edges = DEFAULT_EDGES,
  style,
}) => {
  const content = (
    <View style={[styles.flex, padded && styles.padded, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={edges}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

export default ScreenContainer;
