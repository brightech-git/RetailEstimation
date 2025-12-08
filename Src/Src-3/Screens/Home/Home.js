import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const { checkedPct, uncheckedPct } = useMemo(() => {
    const total = Math.max(stats.totalCount, 1);
    return {
      checkedPct: (stats.totalChecked / total) * 100,
      uncheckedPct: (stats.totalUnchecked / total) * 100,
    };
  }, [stats]);

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
  const [filters, setFilters] = useState({
    itemId: "",
    metalId: "",
    subItemId: "",
    itemCtrId: "",
  });
  const [dropdownData, setDropdownData] = useState({
    items: [],
    subItems: [],
    metals: [],
    counters: [],
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

  const showToast = (msg, color = "green") =>
    setToast({ visible: true, message: msg, color });

  const loadStats = useCallback(async () => {
    setStats((s) => ({ ...s, loading: true, refreshing: true }));
    try {
      const data = await service.fetchItemTags({}, 0, 1);
      setStats({
        totalCount: data.totalCount || 0,
        totalChecked: data.totalChecked || 0,
        totalUnchecked: data.totalUnchecked || 0,
        loading: false,
        refreshing: false,
      });
    } catch {
      showToast("Failed to load data", "red");
      setStats((s) => ({ ...s, loading: false, refreshing: false }));
    }
  }, [service]);

  useEffect(() => {
    Promise.all([service.loadAllDropdownData(), loadStats()]).then(([dd]) =>
      setDropdownData(dd)
    );
  }, []);

  const navigate = (f = filters) =>
    navigation.navigate("Results", {
      service,
      initialFilters: f,
      initialDropdownData: dropdownData,
    });

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
          <RefreshControl refreshing={stats.refreshing} onRefresh={loadStats} />
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
            applyFilter={() => {
              showToast("Filters applied");
              navigate();
            }}
            showAll={() => {
              setFilters({});
              navigate({});
            }}
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
