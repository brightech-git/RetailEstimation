import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

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
    printButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-end",
    margin: 10,
  },
  printText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }
});

export default styles;