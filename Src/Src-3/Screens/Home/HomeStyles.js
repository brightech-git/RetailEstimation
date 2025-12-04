import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
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
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  // Mode toggle styles
  modeToggleContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
});

export default styles;