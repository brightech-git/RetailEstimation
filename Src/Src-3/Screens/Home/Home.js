import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import CommonHeader from "../../Components/Header/Header";
import ToastMessage from "../../Components/Toast/Toast";
import { useItemTagService } from "../../Service/ItemTagService";
import FiltersComponent from "../../Components/MainComponents/Filters";

const InventoryStatsCard = React.memo(({ stats, loading, refreshing }) => {
  const checkedPct =
    stats.totalCount > 0 ? (stats.totalChecked / stats.totalCount) * 100 : 0;
  const uncheckedPct =
    stats.totalCount > 0 ? (stats.totalUnchecked / stats.totalCount) * 100 : 0;

  if (loading && !refreshing) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#1C467C" />
        <Text style={styles.loadingText}>Loading inventory...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Inventory Status</Text>
      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total Items</Text>
        <Text style={styles.totalNumber}>{stats.totalCount}</Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.barFill, styles.checked, { flex: checkedPct }]} />
        <View
          style={[styles.barFill, styles.unchecked, { flex: uncheckedPct }]}
        />
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.checked]} />
          <Text style={styles.label}>Checked • {stats.totalChecked}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.unchecked]} />
          <Text style={styles.label}>Unchecked • {stats.totalUnchecked}</Text>
        </View>
      </View>
    </View>
  );
});

const BMGJewellersScreen = ({ navigation }) => {
  const service = useItemTagService();
  const isMounted = useRef(true);
  const initialLoadDone = useRef(false);

  const [filters, setFilters] = useState({
    metalId: null,
    itemCtrId: null,
    itemId: null,
    subItemId: null,
  });

  const [dropdownData, setDropdownData] = useState({
    metals: [],
    counters: [],
    items: [],
    subItems: [],
  });

  const [loadingStates, setLoadingStates] = useState({
    items: false,
    subItems: false,
  });

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    color: "green",
  });

  const [stats, setStats] = useState({
    totalCount: 0,
    totalChecked: 0,
    totalUnchecked: 0,
    loading: true,
    refreshing: false,
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const showToast = useCallback((msg, color = "green") => {
    setToast({ visible: true, message: msg, color });
  }, []);

  const loadStats = useCallback(async () => {
    if (!isMounted.current) return;
    setStats((s) => ({ ...s, loading: true }));
    try {
      const data = await service.fetchItemTags({}, 0, 1);
      if (isMounted.current) {
        setStats({
          totalCount: data.totalCount || 0,
          totalChecked: data.totalChecked || 0,
          totalUnchecked: data.totalUnchecked || 0,
          loading: false,
          refreshing: false,
        });
      }
    } catch {
      if (isMounted.current) {
        showToast("Failed to load data", "red");
        setStats((s) => ({ ...s, loading: false, refreshing: false }));
      }
    }
  }, [service, showToast]);

  // Initial load — metals only
useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    service.loadAllDropdownData().then((dropdowns) => {
      if (isMounted.current) {
        setDropdownData({
          metals: dropdowns.metals || [],
          counters: dropdowns.counters || [], // now populated on load
          items: [],
          subItems: [],
        });
      }
    });

    loadStats();
  }, []); // eslint-disable-line

  // Metal change — fetch counters + items together
useEffect(() => {
    if (!filters.metalId) {
      // Reset items/subitems but restore full counter list
      setLoadingStates((prev) => ({ ...prev, items: true }));
      service.fetchFilteredRaw({}).then((data) => {
        if (isMounted.current) {
          setDropdownData((prev) => ({
            ...prev,
            counters: service.extractCounters(data),
            items: [],
            subItems: [],
          }));
        }
      }).finally(() => {
        if (isMounted.current)
          setLoadingStates((prev) => ({ ...prev, items: false }));
      });
      return;
    }

    let cancelled = false;
    setLoadingStates((prev) => ({ ...prev, items: true }));

    service.fetchDropdownsByMetal(filters.metalId).then(({ items, counters }) => {
      if (!cancelled && isMounted.current) {
        setDropdownData((prev) => ({
          ...prev,
          counters: counters || [],
          items: items || [],
          subItems: [],
        }));
      }
    }).catch(() => {
      if (!cancelled && isMounted.current) showToast("Failed to load filters", "red");
    }).finally(() => {
      if (!cancelled && isMounted.current)
        setLoadingStates((prev) => ({ ...prev, items: false }));
    });

    return () => { cancelled = true; };
  }, [filters.metalId]); // eslint-disable-line

  // Item change — fetch subitems
  useEffect(() => {
    if (!filters.itemId || !filters.metalId) {
      setDropdownData((prev) => ({ ...prev, subItems: [] }));
      return;
    }

    let cancelled = false;
    setLoadingStates((prev) => ({ ...prev, subItems: true }));

    service
      .fetchSubItems(filters.itemId, filters.metalId)
      .then((subItems) => {
        if (!cancelled && isMounted.current) {
          setDropdownData((prev) => ({ ...prev, subItems: subItems || [] }));
        }
      })
      .catch(() => {
        if (!cancelled && isMounted.current)
          showToast("Failed to load subitems", "red");
      })
      .finally(() => {
        if (!cancelled && isMounted.current)
          setLoadingStates((prev) => ({ ...prev, subItems: false }));
      });

    return () => {
      cancelled = true;
    };
  }, [filters.itemId, filters.metalId]); // eslint-disable-line

  const navigate = useCallback(
    (filterParams = {}) => {
      const cleanFilters = {};
      Object.keys(filterParams).forEach((key) => {
        const val = filterParams[key];
        if (val !== null && val !== undefined && val !== "") {
          cleanFilters[key] = String(val);
        }
      });

      console.log("Navigating with filters:", cleanFilters);
      navigation.navigate("Results", {
        service,
        initialFilters: cleanFilters,
        initialDropdownData: dropdownData,
      });
    },
    [navigation, service, dropdownData],
  );

  const handleApplyFilter = useCallback(() => {
    const activeFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== undefined) {
        activeFilters[key] = filters[key];
      }
    });
    showToast("Filters applied");
    navigate(activeFilters);
  }, [filters, navigate, showToast]);

  const handleShowAll = useCallback(() => {
    setFilters({
      metalId: null,
      itemCtrId: null,
      itemId: null,
      subItemId: null,
    });
    navigate({});
    showToast("Showing all items");
  }, [navigate, showToast]);

  return (
    <View style={styles.container}>
      <ToastMessage
        {...toast}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
      <CommonHeader
        title="Stock Checker"
        titleColor="#000"
        onLeftPress={() => navigation.goBack()}
        leftIcon="arrow-back"
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={stats.refreshing}
            onRefresh={() => {
              setStats((s) => ({ ...s, refreshing: true }));
              loadStats();
            }}
          />
        }
      >
        <InventoryStatsCard
          stats={stats}
          loading={stats.loading}
          refreshing={stats.refreshing}
        />
        <View style={styles.card}>
          <FiltersComponent
            filters={filters}
            setFilters={setFilters}
            dropdownData={dropdownData}
            applyFilter={handleApplyFilter}
            showAll={handleShowAll}
            loadingStates={loadingStates}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C467C",
    marginBottom: 16,
  },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  totalLabel: { fontSize: 16, color: "#666" },
  totalNumber: { fontSize: 28, fontWeight: "800", color: "#1C467C" },
  bar: {
    height: 14,
    borderRadius: 7,
    overflow: "hidden",
    flexDirection: "row",
    marginVertical: 16,
    backgroundColor: "#eee",
  },
  barFill: { height: "100%" },
  checked: { backgroundColor: "#28a745" },
  unchecked: { backgroundColor: "#dc3545" },
  legend: { flexDirection: "row", justifyContent: "space-around" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { fontSize: 16, color: "#444" },
  loadingText: { marginTop: 12, color: "#666", textAlign: "center" },
});

export default React.memo(BMGJewellersScreen);
