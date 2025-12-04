import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  ActivityIndicator,
  RefreshControl 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CommonHeader from "../../Components/Header/Header";
import ToastMessage from "../../Components/Toast/Toast";
import BarcodeScannerModal from "../../Components/Scanner/Scanner3";
import { useItemTagService } from "../../Service/ItemTagService";

import ScanUpdateComponent from "../../Components/MainComponents/ScanUpdate";
import FiltersComponent from "../../Components/MainComponents/Filters";
import TableComponent from "../../Components/MainComponents/Table";
import styles from "./HomeStyles";

const BMGJewellersScreen = () => {
  const service = useItemTagService();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [mode, setMode] = useState("manual");
  const [formData, setFormData] = useState({ itemId: "", tagNo: "" });
  const [filters, setFilters] = useState({ itemId: "", metalId: "", subItemId: "", itemCtrId: "" });
  const [dropdownData, setDropdownData] = useState({ items: [], subItems: [], metals: [], counters: [] });
  const [itemTags, setItemTags] = useState([]);
  const [toastData, setToastData] = useState({ visible: false, message: "", color: "green" });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalChecked, setTotalChecked] = useState(0);
  const [totalUnchecked, setTotalUnchecked] = useState(0);

  const showTopToast = (message, color = "green") => {
    setToastData({ visible: true, message, color });
  };

  const hideToast = () => {
    setToastData(prev => ({ ...prev, visible: false }));
  };

  const loadData = useCallback(async (page = 0, isLoadMore = false) => {
    // Don't load if already loading
    if ((isLoadMore && loadingMore) || (!isLoadMore && loading)) return;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const pageSize = 20;
      const data = await service.fetchItemTags(filters, page, pageSize);
      
      if (data && data.itemTags) {
        if (isLoadMore && page > 0) {
          // Append new data when clicking Load More
          setItemTags(prev => [...prev, ...data.itemTags]);
        } else {
          // Replace data when loading fresh
          setItemTags(data.itemTags);
        }
        
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 0);
        setCurrentPage(data.currentPage || page);
        setHasMore(data.hasMore || false);
        setTotalChecked(data.totalChecked || 0);
        setTotalUnchecked(data.totalUnchecked || 0);
        
        if (page === 0 && !isLoadMore && data.itemTags.length > 0) {
          showTopToast(`Loaded ${data.itemTags.length} items`, "green");
        }
        
        if (isLoadMore && data.itemTags.length > 0) {
          showTopToast(`Loaded ${data.itemTags.length} more items`, "green");
        }
      } else {
        setItemTags([]);
        setTotalCount(0);
        setTotalPages(0);
        setHasMore(false);
        setTotalChecked(0);
        setTotalUnchecked(0);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showTopToast("Failed to load data", "red");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [filters, loading, loadingMore]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const data = await service.loadAllDropdownData();
        setDropdownData(data);
        await loadData(0, false);
      } catch (error) {
        console.error("Initialization error:", error);
        showTopToast("Failed to initialize", "red");
      }
    };
    init();
  }, []);

  const submitManualData = async () => {
    const { itemId, tagNo } = formData;
    
    if (!itemId || !tagNo) {
      showTopToast("Item ID and Tag No are required", "red");
      return;
    }

    if (itemId.trim() === "" || tagNo.trim() === "") {
      showTopToast("Please enter valid Item ID and Tag No", "red");
      return;
    }

    try {
      showTopToast("Updating item...", "blue");
      
      const result = await service.updateItemCheck(itemId.trim(), tagNo.trim());
      
      if (result) {
        if (result.status === "failed") {
          showTopToast(result.message || "Update failed", "red");
        } else {
          showTopToast(result.message || "Item updated successfully!", "green");
        }
      } else {
        showTopToast("Update completed", "green");
      }
      
      setFormData({ itemId: "", tagNo: "" });
      
      // Reload first page after update
      await loadData(0, false);
      
    } catch (error) {
      console.error("Update error:", error);
      showTopToast("Update failed. Please try again.", "red");
    }
  };

  const applyFilter = () => {
    showTopToast("Applying filters...", "blue");
    setCurrentPage(0);
    loadData(0, false);
  };

  const showAll = () => {
    const emptyFilters = { itemId: "", metalId: "", subItemId: "", itemCtrId: "" };
    setFilters(emptyFilters);
    showTopToast("Showing all items...", "blue");
    setCurrentPage(0);
    loadData(0, false);
  };

  const handleScannedData = async (data) => {
    setScannerVisible(false);
    const [itemId, tagNo] = data.split("-");
    
    if (!itemId || !tagNo) {
      showTopToast("Invalid QR Format. Expected format: 4-7894", "red");
      return;
    }

    setFormData({ itemId, tagNo });
    
    if (mode === "manual") {
      showTopToast("QR scanned. Click UPDATE ITEM to confirm.", "blue");
      return;
    }

    try {
      showTopToast("Processing scanned item...", "blue");
      
      const result = await service.updateItemCheck(itemId, tagNo);
      
      if (result) {
        if (result.status === "failed") {
          showTopToast(result.message || "Update failed", "red");
        } else {
          showTopToast(result.message || "Item updated successfully!", "green");
        }
      } else {
        showTopToast("Item updated!", "green");
      }
      
      await loadData(0, false);
      
    } catch (error) {
      console.error("Scan update error:", error);
      showTopToast("Failed to update scanned item", "red");
    }
  };

  // Handle Load More button click
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadData(currentPage + 1, true);
    }
  };

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(0, false);
  }, [loadData]);

  // Calculate percentage for progress bar
  const checkedPercentage = totalCount > 0 ? (totalChecked / totalCount) * 100 : 0;
  const uncheckedPercentage = totalCount > 0 ? (totalUnchecked / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      <ToastMessage 
        visible={toastData.visible} 
        message={toastData.message} 
        color={toastData.color} 
        onHide={hideToast} 
      />

      <CommonHeader 
        title="BMG Jewellers" 
        leftIcon="menu" 
        rightIcon="search" 
        backgroundColor="#fff" 
        titleColor="#000" 
        iconColor="#1C467C" 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1C467C"]}
            tintColor="#1C467C"
          />
        }
      >
        <View style={styles.formCard}>
          {/* Item Stats at the top */}
          <View style={localStyles.statsContainerTop}>
            <View style={localStyles.statsHeader}>
              <Text style={localStyles.statsTitle}>Inventory Status</Text>
              <Text style={localStyles.statsTotal}>Total: {totalCount}</Text>
            </View>
            
            {/* Progress Bar */}
            <View style={localStyles.progressBarContainer}>
              <View style={[localStyles.progressChecked, { width: `${checkedPercentage}%` }]} />
              <View style={[localStyles.progressUnchecked, { width: `${uncheckedPercentage}%` }]} />
            </View>
            
            <View style={localStyles.statsDetails}>
              <View style={localStyles.statItem}>
                <View style={[localStyles.statDot, localStyles.checkedDot]} />
                <Text style={localStyles.statLabel}>Checked</Text>
                <Text style={[localStyles.statValue, localStyles.checkedValue]}>{totalChecked}</Text>
              </View>
              
              <View style={localStyles.statItem}>
                <View style={[localStyles.statDot, localStyles.uncheckedDot]} />
                <Text style={localStyles.statLabel}>Unchecked</Text>
                <Text style={[localStyles.statValue, localStyles.uncheckedValue]}>{totalUnchecked}</Text>
              </View>
            </View>
          </View>

          {/* Mode Toggle */}
          <View style={localStyles.modeToggleContainer}>
            <Text style={localStyles.sectionTitle}>Update Mode</Text>
            <View style={localStyles.modeToggle}>
              <TouchableOpacity 
                style={[
                  localStyles.modeOption, 
                  mode === "automatic" && localStyles.activeMode
                ]} 
                onPress={() => setMode("automatic")}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={mode === "automatic" ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color="#1C467C" 
                />
                <Text style={[
                  localStyles.modeText, 
                  mode === "automatic" && localStyles.activeModeText
                ]}>
                  Automatic
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  localStyles.modeOption, 
                  mode === "manual" && localStyles.activeMode
                ]} 
                onPress={() => setMode("manual")}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={mode === "manual" ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color="#1C467C" 
                />
                <Text style={[
                  localStyles.modeText, 
                  mode === "manual" && localStyles.activeModeText
                ]}>
                  Manual
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScanUpdateComponent
            mode={mode}
            formData={formData}
            setFormData={setFormData}
            submitManualData={submitManualData}
            setScannerVisible={setScannerVisible}
          />

          <FiltersComponent
            filters={filters}
            setFilters={setFilters}
            dropdownData={dropdownData}
            applyFilter={applyFilter}
            showAll={showAll}
          />

          {loading && !refreshing ? (
            <View style={localStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#1C467C" />
              <Text style={localStyles.loadingText}>Loading items...</Text>
            </View>
          ) : (
            <TableComponent 
              itemTags={itemTags}
              onLoadMore={handleLoadMore}
              loadingMore={loadingMore}
              hasMore={hasMore}
              totalCount={totalCount}
            />
          )}
        </View>
      </ScrollView>

      <BarcodeScannerModal 
        visible={scannerVisible} 
        onClose={() => setScannerVisible(false)} 
        onScanned={handleScannedData} 
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  // Stats Container at the top
  statsContainerTop: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C467C",
  },
  statsTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: 16,
  },
  progressChecked: {
    height: "100%",
    backgroundColor: "#28a745",
  },
  progressUnchecked: {
    height: "100%",
    backgroundColor: "#dc3545",
  },
  statsDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  checkedDot: {
    backgroundColor: "#28a745",
  },
  uncheckedDot: {
    backgroundColor: "#dc3545",
  },
  statLabel: {
    fontSize: 13,
    color: "#6c757d",
    marginRight: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "600",
    marginRight: 4,
  },
  checkedValue: {
    color: "#28a745",
  },
  uncheckedValue: {
    color: "#dc3545",
  },
  statPercentage: {
    fontSize: 12,
    color: "#6c757d",
  },
  paginationInfoTop: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  paginationText: {
    fontSize: 13,
    color: "#495057",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
  moreAvailableText: {
    fontSize: 12,
    color: "#1C467C",
    fontWeight: "500",
    textAlign: "center",
  },

  // Mode Toggle Styles
  modeToggleContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  modeToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 32,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeMode: {
    backgroundColor: "#f0f8ff",
  },
  modeText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#666",
  },
  activeModeText: {
    color: "#1C467C",
    fontWeight: "600",
  },

  // Loading Styles
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
});

export default BMGJewellersScreen;