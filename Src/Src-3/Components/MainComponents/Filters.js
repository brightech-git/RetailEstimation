import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DropdownInput from "./DropDown";

const FiltersComponent = ({ filters, setFilters, dropdownData, applyFilter, showAll }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Filters</Text>
      <View style={styles.filterContainer}>
        <DropdownInput
          label="Item Name"
          selectedValue={filters.itemId}
          onSelect={(id) => setFilters(prev => ({ ...prev, itemId: id }))}
          options={dropdownData.items}
        />
        <DropdownInput
          label="SubItem"
          selectedValue={filters.subItemId}
          onSelect={(id) => setFilters(prev => ({ ...prev, subItemId: id }))}
          options={dropdownData.subItems}
        />
        <DropdownInput
          label="Metal"
          selectedValue={filters.metalId}
          onSelect={(id) => setFilters(prev => ({ ...prev, metalId: id }))}
          options={dropdownData.metals}
        />
        <DropdownInput
          label="Counter"
          selectedValue={filters.itemCtrId}
          onSelect={(id) => setFilters(prev => ({ ...prev, itemCtrId: id }))}
          options={dropdownData.counters}
        />
      </View>

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

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#D97706",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  allButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#D97706",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  allButtonText: {
    color: "#D97706",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default FiltersComponent;