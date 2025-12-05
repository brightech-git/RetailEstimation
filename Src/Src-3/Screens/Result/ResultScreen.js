import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ToastMessage from "../../Components/Toast/Toast";
import BarcodeScannerModal from "../../Components/Scanner/Scanner3";
import ScanUpdateComponent from "../../Components/MainComponents/ScanUpdate";
import TableComponent from "../../Components/MainComponents/Table";

const { width } = Dimensions.get("window");

const PAGE_SIZE = 20;
const INITIAL_FILTERS = {
  itemId: "",
  metalId: "",
  subItemId: "",
  itemCtrId: "",
};
const INITIAL_DROPDOWN_DATA = {
  items: [],
  subItems: [],
  metals: [],
  counters: [],
};

const ResultsScreen = ({ route, navigation }) => {
  const {
    service,
    initialFilters = INITIAL_FILTERS,
    initialDropdownData = INITIAL_DROPDOWN_DATA,
  } = route.params;

  // State
  const [scannerVisible, setScannerVisible] = useState(false);
  const [mode, setMode] = useState("manual");
  const [formData, setFormData] = useState({ itemId: "", tagNo: "" });
  const [filters, setFilters] = useState(initialFilters);
  const [dropdownData, setDropdownData] = useState(initialDropdownData);
  const [itemTags, setItemTags] = useState([]);
  const [toastData, setToastData] = useState({
    visible: false,
    message: "",
    color: "green",
  });
  const [recentlyUpdatedItem, setRecentlyUpdatedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalChecked, setTotalChecked] = useState(0);
  const [totalUnchecked, setTotalUnchecked] = useState(0);

  // Toast
  const showTopToast = useCallback((message, color = "green") => {
    setToastData({ visible: true, message, color });
  }, []);

  const hideToast = useCallback(() => {
    setToastData((prev) => ({ ...prev, visible: false }));
  }, []);

  // Filter label helper
  const getFilterLabel = useCallback(
    (key, value) => {
      if (!value) return null;

      const getLabelFromDropdown = (dataKey) => {
        const items = dropdownData[dataKey];
        if (!items || !Array.isArray(items)) return { name: value, id: value };

        const item = items.find((item) => {
          if (item.id && item.id.toString() === value.toString()) return item;
          if (item.value && item.value.toString() === value.toString()) return item;
          return false;
        });

        return item
          ? { name: item.name || item.label || value, id: item.id || item.value || value }
          : { name: value, id: value };
      };

      const dataKeys = {
        itemId: "items",
        subItemId: "subItems",
        metalId: "metals",
        itemCtrId: "counters",
      };

      const result = getLabelFromDropdown(dataKeys[key] || "");

      const config = {
        itemId: { label: "ITEM" },
        subItemId: { label: "SUB ITEM" },
        metalId: { label: "METAL" },
        itemCtrId: { label: "COUNTER" },
      };

      const { label } = config[key] || { label: key };

      return {
        label,
        value: result.name,
        id: result.id,
        fullText: ` (ID: ${result.id})${result.name}`,
      };
    },
    [dropdownData]
  );

  // Active filters
  const activeFilters = useMemo(() => {
    return Object.entries(filters)
      .filter(([_, value]) => value && value.trim() !== "")
      .map(([key, value]) => getFilterLabel(key, value))
      .filter(Boolean);
  }, [filters, getFilterLabel]);

  // Percentages
  const checkedPercentage = useMemo(
    () => (totalCount > 0 ? (totalChecked / totalCount) * 100 : 0),
    [totalCount, totalChecked]
  );
  
  const uncheckedPercentage = 100 - checkedPercentage;

  // Data loading
  const loadData = useCallback(
    async (page = 0, isLoadMore = false) => {
      if ((isLoadMore && loadingMore) || (!isLoadMore && loading)) return;

      isLoadMore ? setLoadingMore(true) : setLoading(true);

      try {
        const data = await service.fetchItemTags(filters, page, PAGE_SIZE);

        if (data?.itemTags) {
          setItemTags((prev) =>
            isLoadMore && page > 0 ? [...prev, ...data.itemTags] : data.itemTags
          );
          setTotalCount(data.totalCount || 0);
          setTotalPages(data.totalPages || 0);
          setCurrentPage(data.currentPage || page);
          setHasMore(data.hasMore || false);
          setTotalChecked(data.totalChecked || 0);
          setTotalUnchecked(data.totalUnchecked || 0);
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
    },
    [filters, loading, loadingMore, service, showTopToast]
  );

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // Auto refresh stats
  const refreshStatsOnly = useCallback(async () => {
    try {
      const data = await service.fetchItemTags(filters, 0, PAGE_SIZE);
      if (data) {
        setTotalChecked(data.totalChecked || 0);
        setTotalUnchecked(data.totalUnchecked || 0);
        setTotalCount(data.totalCount || 0);
      }
    } catch (e) {
      console.log("Auto refresh failed");
    }
  }, [filters, service]);

  useEffect(() => {
    const interval = setInterval(refreshStatsOnly, 10);
    return () => clearInterval(interval);
  }, [refreshStatsOnly]);

  // Item update
  const handleItemUpdate = useCallback(
    async (itemId, tagNo, isManual = false) => {
      if (!itemId?.trim() || !tagNo?.trim()) {
        showTopToast(
          isManual ? "Item ID and Tag No are required" : "Invalid QR Format",
          "red"
        );
        return;
      }

      try {
        showTopToast(
          isManual ? "Updating item..." : "Processing scanned item...",
          "blue"
        );

        const result = await service.updateItemCheck(itemId.trim(), tagNo.trim());

        if (result) {
          if (result.status === "failed") {
            showTopToast(result.message || "Update failed", "red");
            setRecentlyUpdatedItem(null);
          } else {
            showTopToast(result.message || "Item updated successfully!", "green");
            setRecentlyUpdatedItem(result.data);
          }
        } else {
          showTopToast("Update completed", "green");
          setRecentlyUpdatedItem(null);
        }

        if (isManual) setFormData({ itemId: "", tagNo: "" });
        await loadData(0, false);
      } catch (error) {
        console.error("Update error:", error);
        showTopToast("Update failed. Please try again.", "red");
        setRecentlyUpdatedItem(null);
      }
    },
    [loadData, service, showTopToast]
  );

  const submitManualData = useCallback(() => {
    handleItemUpdate(formData.itemId, formData.tagNo, true);
  }, [formData, handleItemUpdate]);

  // Scanner handler
  const handleScannedData = useCallback(
    async (data) => {
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

      await handleItemUpdate(itemId, tagNo, false);
    },
    [mode, handleItemUpdate, showTopToast]
  );

  // Pagination
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadData(currentPage + 1, true);
    }
  }, [loadingMore, hasMore, currentPage, loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(0, false);
  }, [loadData]);

  // Components
  const FilterSummaryComponent = useMemo(() => {
    if (activeFilters.length === 0) return null;

    return (
      <View style={styles.filterSummaryContainer}>
        <Text style={styles.filterSummaryTitle}>Active Filters</Text>
        <View style={styles.filterList}>
          {activeFilters.map((filter, index) => (
            <View key={index} style={styles.filterRow}>
              <Text style={styles.filterRowLabel}>{filter.label}:</Text>
              <Text style={styles.filterRowValue}>
                {filter.value}
                <Text style={styles.filterTagId}> (ID: {filter.id})</Text>
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.filteredCount}>
          Showing {totalCount} items matching {activeFilters.length} filter
          {activeFilters.length > 1 ? "s" : ""}
        </Text>
      </View>
    );
  }, [activeFilters, totalCount]);

  const RecentlyUpdatedItem = useMemo(() => {
    if (!recentlyUpdatedItem) return null;

    const columns = [
      { key: "ITEMID", label: "ITEMID", width: 100 },
      { key: "TAGNO", label: "TAG NO", width: 100, color: "#1a73e8" },
      { key: "PCS", label: "PCS", width: 80 },
      { key: "GRSWT", label: "GROSS WT", width: 100 },
      { key: "NETWT", label: "NET WT", width: 100 },
      {
        key: "RECDATE",
        label: "RECDATE",
        width: 100,
        formatter: (value) => value?.split("T")[0] || "-",
      },
      { key: "ITEMNAME", label: "ITEMNAME", width: 120 },
      { key: "SUBITEMNAME", label: "SUB ITEM", width: 100 },
      { key: "ITEMCTRNAME", label: "COUNTER", width: 100 },
      { key: "ITEMTYPENAME", label: "ITEM TYPE", width: 100 },
    ];

    return (
      <View style={styles.recentUpdateContainer}>
        <View style={styles.recentUpdateHeader}>
          <Text style={styles.recentUpdateTitle}>
            <Ionicons name="checkmark-circle" size={16} color="#28a745" /> Recently Updated
          </Text>
          <TouchableOpacity onPress={() => setRecentlyUpdatedItem(null)}>
            <Ionicons name="close-circle" size={22} color="#666" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.tableHeader}>
              {columns.map((col) => (
                <Text key={col.key} style={[styles.headerCell, { width: col.width }]}>
                  {col.label}
                </Text>
              ))}
            </View>
            <View style={styles.tableRow}>
              {columns.map((col) => {
                const value = col.formatter
                  ? col.formatter(recentlyUpdatedItem[col.key])
                  : recentlyUpdatedItem[col.key];
                return (
                  <Text
                    key={col.key}
                    style={[styles.cell, { width: col.width }, col.color && { color: col.color }]}
                  >
                    {value}
                  </Text>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }, [recentlyUpdatedItem]);

  const ModeToggle = useMemo(
    () => (
      <View style={styles.modeToggleContainer}>
        <Text style={styles.sectionTitle}>Update Mode</Text>
        <View style={styles.modeToggle}>
          {["automatic", "manual"].map((modeOption) => (
            <TouchableOpacity
              key={modeOption}
              style={[styles.modeOption, mode === modeOption && styles.activeMode]}
              onPress={() => setMode(modeOption)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={mode === modeOption ? "radio-button-on" : "radio-button-off"}
                size={20}
                color="#1C467C"
              />
              <Text style={[styles.modeText, mode === modeOption && styles.activeModeText]}>
                {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [mode]
  );

  const StatsComponent = useMemo(
    () => (
      <View style={styles.statsContainerTop}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Inventory Status</Text>
          <Text style={styles.statsTotal}>TOTAL: {totalCount}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressChecked, { width: `${checkedPercentage}%` }]} />
          <View style={[styles.progressUnchecked, { width: `${uncheckedPercentage}%` }]} />
        </View>
        <View style={styles.statsDetails}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.checkedDot]} />
            <Text style={styles.statLabel}>Checked</Text>
            <Text style={[styles.statValue, styles.checkedValue]}>{totalChecked}</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.uncheckedDot]} />
            <Text style={styles.statLabel}>Unchecked</Text>
            <Text style={[styles.statValue, styles.uncheckedValue]}>{totalUnchecked}</Text>
          </View>
        </View>
      </View>
    ),
    [totalCount, checkedPercentage, uncheckedPercentage, totalChecked, totalUnchecked]
  );

  return (
    <View style={styles.container}>
      <ToastMessage
        visible={toastData.visible}
        message={toastData.message}
        color={toastData.color}
        onHide={hideToast}
        style={styles.toast}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
          {StatsComponent}
          {FilterSummaryComponent}
          {ModeToggle}
          
          <ScanUpdateComponent
            mode={mode}
            formData={formData}
            setFormData={setFormData}
            submitManualData={submitManualData}
            setScannerVisible={setScannerVisible}
          />

          {RecentlyUpdatedItem}

          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1C467C" />
              <Text style={styles.loadingText}>Loading items...</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toast: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 10,
  },
  
  // Stats
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
    fontSize: 18,
    fontWeight: "700",
    color: "#1C467C",
  },
  statsTotal: {
    fontSize: 18,
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
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 5,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 18,
    color: "#6c757d",
    marginRight: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "600",
  },
  checkedValue: {
    color: "#28a745",
  },
  uncheckedValue: {
    color: "#dc3545",
  },
  
  // Filter Summary
  filterSummaryContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderLeftWidth: 4,
    borderLeftColor: "#1C467C",
  },
  filterSummaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C467C",
    marginBottom: 12,
  },
  filterList: {
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  filterRowLabel: {
    width: 90,
    fontSize: 14,
    color: "#495057",
    fontWeight: "600",
  },
  filterRowValue: {
    flex: 1,
    fontSize: 14,
    color: "#1C467C",
    fontWeight: "700",
    marginLeft: 10,
  },
  filterTagId: {
    color: "#666",
    fontWeight: "500",
    fontSize: 13,
  },
  filteredCount: {
    fontSize: 14,
    color: "#6c757d",
    fontStyle: "italic",
    marginTop: 8,
  },
  
  // Mode Toggle
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
  
  // Recently Updated
  recentUpdateContainer: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#cce7ff",
    borderLeftWidth: 4,
    borderLeftColor: "#1C467C",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  recentUpdateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e1f0ff",
  },
  recentUpdateTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C467C",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0A3D7E",
    paddingVertical: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#EAF4FF",
    paddingVertical: 10,
  },
  cell: {
    textAlign: "center",
    color: "#000",
    fontSize: 14,
  },
  
  // Loading
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

export default ResultsScreen;