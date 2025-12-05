import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  Modal
} from "react-native";

const { width } = Dimensions.get('window');

const TableComponent = ({ 
  itemTags, 
  onLoadMore, 
  loadingMore, 
  hasMore,
  totalCount = 0
}) => {
  const [filter, setFilter] = useState("all"); // "all", "checked", "unchecked"
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Filter items based on selected filter
  const filteredItems = itemTags.filter(item => {
    if (filter === "all") return true;
    if (filter === "checked") return item.isChecked === true;
    if (filter === "unchecked") return !item.isChecked || item.isChecked === false;
    return true;
  });
  
  // Separate checked and unchecked items from filtered items
  const checkedItems = filteredItems.filter(item => item.isChecked === true);
  const uncheckedItems = filteredItems.filter(item => !item.isChecked || item.isChecked === false);
  
  // Combine with checked items first for display
  const sortedItems = [...checkedItems, ...uncheckedItems];

  const columnWidths = {
    itemId: 60,
    tagNo: 90,
    pcs: 60,
    grswt: 90,
    netwt: 90,
    recdate: 120,
    itemname: 140,
    subitemname: 150,
    itemctrname: 150,
    itemtypename: 150,
  };

  const totalWidth = Object.values(columnWidths).reduce((a, b) => a + b, 0);
  
  const filterOptions = [
    { label: "All Items", value: "all" },
    { label: "Checked Only", value: "checked" },
    { label: "Unchecked Only", value: "unchecked" }
  ];

  // Render a table row with conditional styling
  const renderTableRow = ({ item, index }) => {
    const isChecked = item.isChecked === true;
    
    return (
      <View style={[
        styles.tableRow,
        index % 2 === 0 ? styles.evenRow : styles.oddRow,
        isChecked && styles.checkedRow
      ]}>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.itemId },
          isChecked && styles.checkedText
        ]} numberOfLines={1}>
          {item.ITEMID}
        </Text>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.tagNo },
          isChecked && styles.checkedText
        ]} numberOfLines={1}>
          {item.TAGNO}
        </Text>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.pcs },
          isChecked && styles.checkedText
        ]} numberOfLines={1}>
          {item.PCS}
        </Text>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.grswt },
          isChecked && styles.checkedText
        ]} numberOfLines={1}>
          {item.GRSWT}
        </Text>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.netwt },
          isChecked && styles.checkedText
        ]} numberOfLines={1}>
          {item.NETWT}
        </Text>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.recdate },
          isChecked && styles.checkedText
        ]} numberOfLines={1}>
          {item.RECDATE?.split(" ")[0] || '-'}
        </Text>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.itemname },
          isChecked && styles.checkedText
        ]} numberOfLines={2}>
          {item.ITEMNAME || '-'}
        </Text>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.subitemname },
          isChecked && styles.checkedText
        ]} numberOfLines={2}>
          {item.SUBITEMNAME || '-'}
        </Text>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.itemctrname },
          isChecked && styles.checkedText
        ]} numberOfLines={2}>
          {item.ITEMCTRNAME || '-'}
        </Text>
        <Text style={[
          styles.rowCell, 
          { width: columnWidths.itemtypename },
          isChecked && styles.checkedText
        ]} numberOfLines={2}>
          {item.ITEMTYPENAME || '-'}
        </Text>
      </View>
    );
  };
  
  const getFilterLabel = (value) => {
    const option = filterOptions.find(opt => opt.value === value);
    return option ? option.label : "Filter";
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.formTitle}>ITEM LIST</Text>
        
        {/* Filter Dropdown */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterDropdown(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.filterButtonText}>{getFilterLabel(filter)}</Text>
          <Text style={styles.filterArrow}>▼</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ width: totalWidth }}
      >
        <View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: columnWidths.itemId }]}>ITEMID</Text>
            <Text style={[styles.headerCell, { width: columnWidths.tagNo }]}>TAG NO</Text>
            <Text style={[styles.headerCell, { width: columnWidths.pcs }]}>PCS</Text>
            <Text style={[styles.headerCell, { width: columnWidths.grswt }]}>GROSS WT</Text>
            <Text style={[styles.headerCell, { width: columnWidths.netwt }]}>NET WT</Text>
            <Text style={[styles.headerCell, { width: columnWidths.recdate }]}>REC DATE</Text>
            <Text style={[styles.headerCell, { width: columnWidths.itemname }]}>ITEM NAME</Text>
            <Text style={[styles.headerCell, { width: columnWidths.subitemname }]}>SUBITEM</Text>
            <Text style={[styles.headerCell, { width: columnWidths.itemctrname }]}>COUNTER</Text>
            <Text style={[styles.headerCell, { width: columnWidths.itemtypename }]}>ITEM TYPE</Text>
          </View>

          {/* Table Body */}
          <FlatList
            data={sortedItems}
            keyExtractor={(item, index) => `${item.TAGNO}-${item.ITEMID}-${index}-${item.isChecked}`}
            renderItem={renderTableRow}
            ListEmptyComponent={
              itemTags.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No items found</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No {filter !== "all" ? filter : ""} items found
                  </Text>
                </View>
              )
            }
            showsVerticalScrollIndicator={true}
          />
        </View>
      </ScrollView>
      
      {/* Filter Dropdown Modal */}
      <Modal
        transparent={true}
        visible={showFilterDropdown}
        animationType="fade"
        onRequestClose={() => setShowFilterDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                  filter === option.value && styles.dropdownItemSelected
                ]}
                onPress={() => {
                  setFilter(option.value);
                  setShowFilterDropdown(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  filter === option.value && styles.dropdownItemTextSelected
                ]}>
                  {option.label}
                </Text>
                {filter === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Load More Button */}
      {sortedItems.length > 0 && hasMore && (
        <TouchableOpacity 
          style={[styles.loadMoreButton, loadingMore && styles.loadMoreButtonDisabled]}
          onPress={onLoadMore}
          activeOpacity={0.7}
          disabled={loadingMore}
        >
          {loadingMore ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadMoreText}>Loading...</Text>
            </View>
          ) : (
            <Text style={styles.loadMoreText}>
              Load More Items ({sortedItems.length} of {totalCount > 0 ? totalCount : '?'} shown)
            </Text>
          )}
        </TouchableOpacity>
      )}
      
      {/* Show message when all items are loaded */}
      {sortedItems.length > 0 && !hasMore && (
        <View style={styles.allLoadedContainer}>
          <Text style={styles.allLoadedText}>
            All {sortedItems.length} items loaded ({checkedItems.length} checked, {uncheckedItems.length} unchecked)
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  filterArrow: {
    fontSize: 10,
    color: "#666",
  },
  filterInfoContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  filterInfoText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1C467C",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 4,
    minHeight: 45,
    alignItems: "center",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#f9f9f9",
  },
  checkedRow: {
    backgroundColor: "#e3f2fd",
  },
  rowCell: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 4,
    color: "#333",
  },
  checkedText: {
    color: "#1565c0",
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: width * 0.7,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemSelected: {
    backgroundColor: "#e3f2fd",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#333",
  },
  dropdownItemTextSelected: {
    color: "#1C467C",
    fontWeight: "600",
  },
  checkmark: {
    color: "#1C467C",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadMoreButton: {
    backgroundColor: "#1C467C",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    elevation: 2,
  },
  loadMoreButtonDisabled: {
    backgroundColor: "#6c757d",
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  allLoadedContainer: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  allLoadedText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default TableComponent;