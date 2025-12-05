import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

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
  
  // Warning
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3cd",
    borderWidth: 1,
    borderColor: "#ffeaa7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    marginLeft: 10,
    color: "#856404",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
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

export default styles;