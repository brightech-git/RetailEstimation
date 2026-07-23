// Phase 4 – Shared Components
// Reusable search input with a leading icon and optional clear button. UI only.
import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@design";
import { makeStyles } from "./styles";
import type { SearchBarProps } from "./types";

const styles = makeStyles(theme);

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onClear,
  autoFocus,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name="search"
        size={18}
        color={theme.colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        autoFocus={autoFocus}
        style={styles.input}
        returnKeyType="search"
      />
      {value.length > 0 && onClear ? (
        <TouchableOpacity onPress={onClear} style={styles.clear} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchBar;
