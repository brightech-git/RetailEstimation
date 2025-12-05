import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DropdownInput from "./DropDown";
import { Ionicons } from "@expo/vector-icons";

const FiltersComponent = ({
  filters,
  setFilters,
  dropdownData,
  applyFilter,
  showAll,
}) => {
  // Clear filter function
  const clearFilter = () => {
    setFilters({
      itemId: null,
      subItemId: null,
      metalId: null,
      itemCtrId: null,
    });
   
    //applyFilter(); // Uncomment if you want to apply immediately
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.formTitle}>FILTERS</Text>
        <TouchableOpacity onPress={clearFilter} style={styles.clearButton}>
          <Ionicons name="close" size={18} color="#ff0000ff" />
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <DropdownInput
          label="Item Name"
          selectedValue={filters.itemId}
          onSelect={(id) => setFilters((prev) => ({ ...prev, itemId: id }))}
          options={dropdownData.items}
        />
        <DropdownInput
          label="SubItem"
          selectedValue={filters.subItemId}
          onSelect={(id) => setFilters((prev) => ({ ...prev, subItemId: id }))}
          options={dropdownData.subItems}
        />
        <DropdownInput
          label="Metal"
          selectedValue={filters.metalId}
          onSelect={(id) => setFilters((prev) => ({ ...prev, metalId: id }))}
          options={dropdownData.metals}
        />
        <DropdownInput
          label="Counter"
          selectedValue={filters.itemCtrId}
          onSelect={(id) => setFilters((prev) => ({ ...prev, itemCtrId: id }))}
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
    color: "#333",
    
  },
  clearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff0000ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius:10,
    borderWidth:1,
    backgroundColor:"#f0eeeeff"
  },
  clearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff0000ff",
    marginRight: 4, // space before icon
  },
});

export default FiltersComponent;
