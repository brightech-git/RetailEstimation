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
import { InventoryStatsCard } from "@modules/stock/components";
import { logger } from "@core/logger";

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
    const data = await service.fetchStats(filters);

    if (isMounted.current) {
      setStats({
        totalCount: data.totalCount || 0,
        totalChecked: data.totalChecked || 0,
        totalUnchecked: data.totalUnchecked || 0,
        loading: false,
        refreshing: false,
      });
    }
  } catch (error) {
    logger.debug("Load stats error:", error);

    if (isMounted.current) {
      showToast("Failed to load stats", "red");
      setStats((s) => ({ ...s, loading: false, refreshing: false }));
    }
  }
}, [filters, showToast]);

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
    setLoadingStates((prev) => ({ ...prev, items: true }));

    service.fetchCounterNames()
      .then((counters) => {
        if (isMounted.current) {
          setDropdownData((prev) => ({
            ...prev,
            counters: counters || [],
            items: [],
            subItems: [],
          }));
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setLoadingStates((prev) => ({ ...prev, items: false }));
        }
      });

    return;
  }

  let cancelled = false;
  setLoadingStates((prev) => ({ ...prev, items: true }));

  Promise.all([
    service.fetchItemsByMetal(filters.metalId),
    service.fetchCounterNames(), // keep full counters OR filter if needed
  ])
    .then(([items, counters]) => {
      if (!cancelled && isMounted.current) {
        setDropdownData((prev) => ({
          ...prev,
          counters: counters || [],
          items: items || [],
          subItems: [],
        }));
      }
    })
    .catch(() => {
      if (!cancelled && isMounted.current) {
        showToast("Failed to load filters", "red");
      }
    })
    .finally(() => {
      if (!cancelled && isMounted.current) {
        setLoadingStates((prev) => ({ ...prev, items: false }));
      }
    });

  return () => {
    cancelled = true;
  };
}, [filters.metalId]);

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

      logger.debug("Navigating with filters:", cleanFilters);
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
});

export default React.memo(BMGJewellersScreen);
