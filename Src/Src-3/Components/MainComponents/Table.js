import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  Dimensions,
  TouchableOpacity,
  Modal
} from "react-native";
import getStyles from "./TableStyles";
import { useTheme } from "../../../Context/ThemeContext";

const { width } = Dimensions.get('window');

const TableComponent = ({
  itemTags,
  onLoadMore,
  loadingMore,
  hasMore,
  totalCount = 0
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
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
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.formTitle}>ITEM LIST</Text>
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

export default TableComponent;