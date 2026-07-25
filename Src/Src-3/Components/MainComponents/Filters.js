import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import DropdownInput from "./DropDown";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../Context/ThemeContext";

const FiltersComponent = ({
  filters,
  setFilters,
  dropdownData,
  applyFilter,
  showAll,
  loadingStates = { items: false, subItems: false }
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const clearFilter = () => {
    setFilters({
      metalId: null,
      itemCtrId: null,
      itemId: null,
      subItemId: null,
    });
  };



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.formTitle}>FILTERS</Text>

        <TouchableOpacity onPress={clearFilter} style={styles.clearButton}>
          <Ionicons name="close" size={18} color={theme.COLORS.danger} />
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdowns */}
      <View style={styles.filterContainer}>
        {/* First row: Metal and Counter */}
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <DropdownInput
              label="Metal"
              selectedValue={filters.metalId}
              onSelect={(id) => {
                console.log("Selected Metal ID:", id);
                setFilters((prev) => ({
                  ...prev,
                  metalId: id,
                  // Reset dependent fields when metal changes
                  itemId: null,
                  subItemId: null,
                }));
              }}
              options={dropdownData.metals || []}
            />
          </View>

          <View style={styles.halfWidth}>
            <DropdownInput
              label="Counter"
              selectedValue={filters.itemCtrId}
              onSelect={(id) => {
                console.log("Selected Counter ID:", id);
                setFilters((prev) => ({
                  ...prev,
                  itemCtrId: id,
                }));
              }}
              options={dropdownData.counters || []}
            />
          </View>
        </View>

        {/* Second row: Item Name and Sub Item */}
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            {loadingStates.items ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.COLORS.warning} />
                <Text style={styles.loadingText}>Loading items...</Text>
              </View>
            ) : (
              <DropdownInput
                label="Item Name"
                selectedValue={filters.itemId}
                onSelect={(id) => {
                  console.log("Selected Item ID:", id);
                  setFilters((prev) => ({
                    ...prev,
                    itemId: id,
                    subItemId: null, // Reset sub item when item changes
                  }));
                }}
                options={dropdownData.items || []}
                disabled={!filters.metalId}
                placeholder={!filters.metalId ? "Select metal first" : "Select Item"}
              />
            )}
          </View>

          <View style={styles.halfWidth}>
            {loadingStates.subItems ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.COLORS.warning} />
                <Text style={styles.loadingText}>Loading subitems...</Text>
              </View>
            ) : (
              <DropdownInput
                label="Sub Item"
                selectedValue={filters.subItemId}
                onSelect={(id) => {
                  console.log("Selected SubItem ID:", id);
                  setFilters((prev) => ({
                    ...prev,
                    subItemId: id,
                  }));
                }}
                options={dropdownData.subItems || []}
                disabled={!filters.itemId}
                placeholder={!filters.itemId ? "Select item first" : "Select Sub Item"}
              />
            )}
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.filterButtons}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={applyFilter}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>APPLY FILTER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.allButton}
          onPress={showAll}
          activeOpacity={0.8}
        >
          <Text style={styles.allButtonText}>SHOW ALL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.COLORS.border,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingHorizontal: 10,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.COLORS.title,
    },
    clearButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      backgroundColor: theme.COLORS.surfaceVariant,
    },
    clearText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.COLORS.danger,
      marginLeft: 4,
    },
    filterContainer: {
      // No flexDirection here as we're using column layout with rows inside
    },
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
      gap: 12,
    },
    halfWidth: {
      flex: 1,
    },
    loadingContainer: {
      width: "100%",
      height: 60,
      borderWidth: 1,
      borderColor: theme.COLORS.border,
      borderRadius: 8,
      backgroundColor: theme.COLORS.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    },
    loadingText: {
      marginLeft: 8,
      color: theme.COLORS.textLight,
      fontSize: 12,
    },
    filterButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      gap: 12,
    },
    applyButton: {
      flex: 1,
      backgroundColor: theme.COLORS.warning,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      elevation: 2,
    },
    applyButtonText: {
      color: theme.COLORS.white,
      fontWeight: "600",
      fontSize: 14,
    },
    allButton: {
      flex: 1,
      backgroundColor: theme.COLORS.cardBackground,
      borderWidth: 2,
      borderColor: theme.COLORS.warning,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    allButtonText: {
      color: theme.COLORS.warning,
      fontWeight: "600",
      fontSize: 14,
    },
  });

export default FiltersComponent;