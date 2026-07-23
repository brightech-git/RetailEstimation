import React, { useState, useEffect, useCallback, useMemo } from "react";
import { logger } from "@core/logger";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ToastMessage from "../../Components/Toast/Toast";
import BarcodeScannerModal from "../../Components/Scanner/Scanner3";
import ScanUpdateComponent from "../../Components/MainComponents/ScanUpdate";
import TableComponent from "../../Components/MainComponents/Table";
import styles from "./ResultStyles"; // Import styles from separate file

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
          if (item.value && item.value.toString() === value.toString())
            return item;
          return false;
        });

        return item
          ? {
              name: item.name || item.label || value,
              id: item.id || item.value || value,
            }
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
        logger.error("Error loading data:", error);
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
    const data = await service.fetchStats(filters);

    if (data) {
      setTotalChecked(data.totalChecked || 0);
      setTotalUnchecked(data.totalUnchecked || 0);
      setTotalCount(data.totalCount || 0);
    }
  } catch (e) {
    logger.debug("Auto refresh failed");
  }
}, [filters, service]);

  useEffect(() => {
    const interval = setInterval(refreshStatsOnly, 1000);
    return () => clearInterval(interval);
  }, [refreshStatsOnly]);

  // Get metal name from metalId using dropdown data
  const getMetalName = useCallback(
    (metalId) => {
      if (
        !metalId ||
        !dropdownData.metals ||
        !Array.isArray(dropdownData.metals)
      ) {
        return metalId || "";
      }

      const metal = dropdownData.metals.find(
        (m) =>
          m.id?.toString() === metalId.toString() ||
          m.value?.toString() === metalId.toString()
      );

      return metal
        ? metal.name || metal.label || metal.value || metalId
        : metalId;
    },
    [dropdownData.metals]
  );

  // Item update
  // In ResultsScreen.js, update the handleItemUpdate function:

  const handleItemUpdate = useCallback(
    async (itemId, tagNo, isManual = false) => {
      if (!itemId?.trim() || !tagNo?.trim()) {
        showTopToast(
          isManual ? "Item ID and Tag No are required" : "Invalid QR Format",
          "red"
        );
        return;
      }

      // Check if required filters are set - make them optional
      // Remove the validation that blocks the update
      /*
    if (!filters.subItemId || !filters.metalId || !filters.itemCtrId) {
      showTopToast(
        "Please set Sub Item, Metal, and Counter filters before updating",
        "red"
      );
      return;
    }
    */

      try {
        showTopToast(
          isManual ? "Updating item..." : "Processing scanned item...",
          "blue"
        );

        // Get filter values (use empty string if not set)
       const subItemId = filters.subItemId || null;
const itemCtrId = filters.itemCtrId || null;
        const metalName = getMetalName(filters.metalId) || "";
        // const itemCtrId = filters.itemCtrId || "";

        // Call service with all parameters (some may be empty strings)
        const result = await service.updateItemCheck(
          itemId.trim(),
          tagNo.trim(),
          subItemId,
          metalName,
          itemCtrId
        );

        if (result) {
          if (result.status === "failed") {
            showTopToast(result.message || "Update failed", "red");
            setRecentlyUpdatedItem(null);
          } else {
            showTopToast(
              result.message || "Item updated successfully!",
              "green"
            );
            setRecentlyUpdatedItem(result.data);
          }
        } else {
          showTopToast("Update completed", "green");
          setRecentlyUpdatedItem(null);
        }

        if (isManual) setFormData({ itemId: "", tagNo: "" });
        await loadData(0, false);
      } catch (error) {
        logger.error("Update error:", error);
        showTopToast("Update failed. Please try again.", "red");
        setRecentlyUpdatedItem(null);
      }
    },
    [filters, getMetalName, loadData, service, showTopToast]
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

    // Get metal name for display
    const getDisplayMetalName = () => {
      if (!filters.metalId) return "Not set";
      return getMetalName(filters.metalId);
    };

    return (
      <View style={styles.filterSummaryContainer}>
        <Text style={styles.filterSummaryTitle}>Active Filters</Text>
        <View style={styles.filterList}>
          {activeFilters.map((filter, index) => (
            <View key={index} style={styles.filterRow}>
              <Text style={styles.filterRowLabel}>{filter.label}:</Text>
              <Text style={styles.filterRowValue}>
                {filter.label === "METAL"
                  ? getDisplayMetalName()
                  : filter.value} - {filter.id}
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
  }, [activeFilters, totalCount, filters.metalId, getMetalName]);

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
            <Ionicons name="checkmark-circle" size={16} color="#28a745" />{" "}
            Recently Updated
          </Text>
          <TouchableOpacity onPress={() => setRecentlyUpdatedItem(null)}>
            <Ionicons name="close-circle" size={22} color="#666" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.tableHeader}>
              {columns.map((col) => (
                <Text
                  key={col.key}
                  style={[styles.headerCell, { width: col.width }]}
                >
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
                    style={[
                      styles.cell,
                      { width: col.width },
                      col.color && { color: col.color },
                    ]}
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
              style={[
                styles.modeOption,
                mode === modeOption && styles.activeMode,
              ]}
              onPress={() => setMode(modeOption)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  mode === modeOption ? "radio-button-on" : "radio-button-off"
                }
                size={20}
                color="#1C467C"
              />
              <Text
                style={[
                  styles.modeText,
                  mode === modeOption && styles.activeModeText,
                ]}
              >
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
          <View
            style={[styles.progressChecked, { width: `${checkedPercentage}%` }]}
          />
          <View
            style={[
              styles.progressUnchecked,
              { width: `${uncheckedPercentage}%` },
            ]}
          />
        </View>
        <View style={styles.statsDetails}>
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.checkedDot]} />
            <Text style={styles.statLabel}>Checked</Text>
            <Text style={[styles.statValue, styles.checkedValue]}>
              {totalChecked}
            </Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statDot, styles.uncheckedDot]} />
            <Text style={styles.statLabel}>Unchecked</Text>
            <Text style={[styles.statValue, styles.uncheckedValue]}>
              {totalUnchecked}
            </Text>
          </View>
        </View>
      </View>
    ),
    [
      totalCount,
      checkedPercentage,
      uncheckedPercentage,
      totalChecked,
      totalUnchecked,
    ]
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

export default ResultsScreen;
