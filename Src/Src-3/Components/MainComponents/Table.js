import React from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity 
} from "react-native";

const { width } = Dimensions.get('window');

const TableComponent = ({ 
  itemTags, 
  onLoadMore, 
  loadingMore, 
  hasMore,
  totalCount = 0  // Add default value
}) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Items List</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ width: totalWidth }}
      >
        <View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: columnWidths.itemId }]}>ItemID</Text>
            <Text style={[styles.headerCell, { width: columnWidths.tagNo }]}>Tag No</Text>
            <Text style={[styles.headerCell, { width: columnWidths.pcs }]}>PCS</Text>
            <Text style={[styles.headerCell, { width: columnWidths.grswt }]}>Gross Wt</Text>
            <Text style={[styles.headerCell, { width: columnWidths.netwt }]}>Net Wt</Text>
            <Text style={[styles.headerCell, { width: columnWidths.recdate }]}>Rec Date</Text>
            <Text style={[styles.headerCell, { width: columnWidths.itemname }]}>Item Name</Text>
            <Text style={[styles.headerCell, { width: columnWidths.subitemname }]}>SubItem</Text>
            <Text style={[styles.headerCell, { width: columnWidths.itemctrname }]}>Counter</Text>
            <Text style={[styles.headerCell, { width: columnWidths.itemtypename }]}>ITEM TYPE</Text>
          </View>

          {/* Table Body - Using FlatList only for rendering, no onEndReached */}
          <FlatList
            data={itemTags}
            keyExtractor={(item, index) => `${item.TAGNO}-${item.ITEMID}-${index}`}
            renderItem={({ item, index }) => (
              <View style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}>
                <Text style={[styles.rowCell, { width: columnWidths.itemId }]} numberOfLines={1}>
                  {item.ITEMID}
                </Text>
                <Text style={[styles.rowCell, { width: columnWidths.tagNo }]} numberOfLines={1}>
                  {item.TAGNO}
                </Text>
                <Text style={[styles.rowCell, { width: columnWidths.pcs }]} numberOfLines={1}>
                  {item.PCS}
                </Text>
                <Text style={[styles.rowCell, { width: columnWidths.grswt }]} numberOfLines={1}>
                  {item.GRSWT}
                </Text>
                <Text style={[styles.rowCell, { width: columnWidths.netwt }]} numberOfLines={1}>
                  {item.NETWT}
                </Text>
                <Text style={[styles.rowCell, { width: columnWidths.recdate }]} numberOfLines={1}>
                  {item.RECDATE?.split(" ")[0] || '-'}
                </Text>
                <Text style={[styles.rowCell, { width: columnWidths.itemname }]} numberOfLines={2}>
                  {item.ITEMNAME || '-'}
                </Text>
                <Text style={[styles.rowCell, { width: columnWidths.subitemname }]} numberOfLines={2}>
                  {item.SUBITEMNAME || '-'}
                </Text>
                <Text style={[styles.rowCell, { width: columnWidths.itemctrname }]} numberOfLines={2}>
                  {item.ITEMCTRNAME || '-'}
                </Text>
                <Text style={[styles.rowCell, { width: columnWidths.itemtypename }]} numberOfLines={2}>
                  {item.ITEMTYPENAME || '-'}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              itemTags.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No items found</Text>
                </View>
              ) : null
            }
            showsVerticalScrollIndicator={true}
          />
        </View>
      </ScrollView>
      
      {/* Load More Button - Only shown when there are more items to load */}
      {itemTags.length > 0 && hasMore && (
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
              Load More Items ({itemTags.length} of {totalCount > 0 ? totalCount : '?'} shown)
            </Text>
          )}
        </TouchableOpacity>
      )}
      
      {/* Show message when all items are loaded */}
      {itemTags.length > 0 && !hasMore && (
        <View style={styles.allLoadedContainer}>
          <Text style={styles.allLoadedText}>
            All {itemTags.length} items loaded
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
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
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
    fontSize: 12,
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
  rowCell: {
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 4,
    color: "#333",
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