import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Modal,
  TouchableWithoutFeedback,
  Dimensions 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const DropdownInput = ({ 
  label, 
  options, 
  selectedValue, 
  onSelect, 
  disabled = false,
  placeholder 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [localSelectedValue, setLocalSelectedValue] = useState(selectedValue);

  // Update local state when prop changes
  useEffect(() => {
    setLocalSelectedValue(selectedValue);
  }, [selectedValue]);

  const safeOptions = Array.isArray(options) ? options : [];

  const filteredOptions = safeOptions.filter(opt => {
    if (!opt || !opt.name) return false;
    return opt.name.toLowerCase().includes(searchText.toLowerCase());
  });

  // Find the display value
  const getDisplayValue = () => {
    if (!localSelectedValue) {
      return placeholder || `Select ${label}`;
    }
    
    const selected = safeOptions.find(
      opt => opt.id?.toString() === localSelectedValue?.toString()
    );
    
    return selected ? selected.name : (placeholder || `Select ${label}`);
  };

  const handleSelect = (id) => {
    setLocalSelectedValue(id);
    onSelect(id);
    setModalVisible(false);
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={[
          styles.dropdownButton,
          disabled && styles.disabledButton
        ]} 
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <Text style={[
          styles.dropdownText,
          disabled && styles.disabledText,
          !localSelectedValue && styles.placeholderText
        ]} numberOfLines={1}>
          {getDisplayValue()}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={disabled ? "#ccc" : "#666"} 
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select {label}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setModalVisible(false);
                      setSearchText("");
                    }}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder={`Search ${label}...`}
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                    autoFocus
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText("")}>
                      <Ionicons name="close-circle" size={20} color="#ccc" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <ScrollView 
                  style={styles.optionsList}
                  showsVerticalScrollIndicator={true}
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map(opt => (
                      <TouchableOpacity
                        key={opt.id?.toString() || Math.random().toString()}
                        style={[
                          styles.optionItem,
                          localSelectedValue?.toString() === opt.id?.toString() && styles.selectedOption
                        ]}
                        onPress={() => handleSelect(opt.id)}
                      >
                        <Text style={[
                          styles.optionText,
                          localSelectedValue?.toString() === opt.id?.toString() && styles.selectedOptionText
                        ]}>
                          {opt.name}
                        </Text>
                        {localSelectedValue?.toString() === opt.id?.toString() && (
                          <Ionicons name="checkmark" size={20} color="#1C467C" />
                        )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.noResults}>
                      <Ionicons name="search-outline" size={40} color="#ccc" />
                      <Text style={styles.noResultsText}>No results found</Text>
                      {searchText.length > 0 && (
                        <TouchableOpacity 
                          style={styles.clearSearchButton}
                          onPress={() => setSearchText("")}
                        >
                          <Text style={styles.clearSearchText}>Clear search</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => {
                      setModalVisible(false);
                      setSearchText("");
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
  },
  disabledButton: {
    backgroundColor: "#f0f0f0",
    borderColor: "#e0e0e0",
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  disabledText: {
    color: "#999",
  },
  placeholderText: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: height * 0.7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedOption: {
    backgroundColor: "#f0f8ff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedOptionText: {
    color: "#1C467C",
    fontWeight: "500",
  },
  noResults: {
    alignItems: "center",
    padding: 40,
  },
  noResultsText: {
    marginTop: 12,
    color: "#999",
    fontSize: 16,
  },
  clearSearchButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  clearSearchText: {
    color: "#666",
    fontSize: 14,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default DropdownInput;