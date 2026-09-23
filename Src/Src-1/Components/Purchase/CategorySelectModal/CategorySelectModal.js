import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../../Context/ThemeContext";
import { useApiBaseUrl } from "../../../../Config/Config";
import createApiInstance from "../../../../Api/axiosInstance";
import ENDPOINTS from "../../../../Api/endpoints";
import { createCategorySelectModalStyles } from "./CategorySelectModalStyles";

const OWNERSHIP_OPTIONS = [
  { key: "OWN", label: "Own", group: 1 },
  { key: "OTHERS", label: "Others", group: 1 },
  { key: "CASH_PURCH", label: "Cash Purch", group: 2 },
  { key: "EXCHANGE", label: "Exchange", group: 2 },
];

const DEFAULT_SELECTION = {
  category: "",
  categoryCode: "",
  item: "",
  itemId: "",
  subItemId: "",
  itemType: "",
  itemTypeId: "",
  metalId: "",
  ownership: ["OWN", "EXCHANGE"],
  description: "",
  purity: "",
  prate: "",
};

// Prevent deselect if it would leave the group empty
const toggleOwnership = (current, key, group) => {
  const groupKeys = OWNERSHIP_OPTIONS.filter((o) => o.group === group).map((o) => o.key);
  const groupSelected = current.filter((k) => groupKeys.includes(k));
  if (current.includes(key) && groupSelected.length === 1) return current;
  const withoutGroup = current.filter((k) => !groupKeys.includes(k));
  return current.includes(key) ? [...withoutGroup] : [...withoutGroup, key];
};

const DropdownField = ({
  label,
  value,
  options,
  onSelect,
  styles,
  theme,
  disabled,
  loading,
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, search]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => {
      const next = !prev;
      if (!next) setSearch("");
      return next;
    });
  };

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownField, disabled && styles.dropdownFieldDisabled]}
        onPress={toggleOpen}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.dropdownFieldText} numberOfLines={1}>
          {value || placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={styles.dropdownCaret.color} />
        ) : (
          <Text style={styles.dropdownCaret}>{open ? "▲" : "▼"}</Text>
        )}
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownList}>
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder={`Search ${label.toLowerCase()}...`}
              placeholderTextColor={theme.COLORS.placeholder}
              autoFocus
              returnKeyType="search"
            />
            {!!search && (
              <TouchableOpacity onPress={() => setSearch("")} hitSlop={8}>
                <Text style={styles.searchClearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
            {filteredOptions.length === 0 ? (
              <View style={styles.dropdownOption}>
                <Text style={styles.dropdownOptionText}>
                  {options.length === 0 ? "No options found" : "No matches"}
                </Text>
              </View>
            ) : (
              filteredOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownOption}
                  onPress={() => {
                    onSelect(option);
                    setSearch("");
                    setOpen(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const CategorySelectModal = ({ visible, initialValue, onClose, onDone }) => {
  const { theme } = useTheme();
  const styles = createCategorySelectModalStyles(theme);
  const apiBaseUrl = useApiBaseUrl();

  const [selection, setSelection] = useState(DEFAULT_SELECTION);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Unique category options derived from allData
  const categoryOptions = useMemo(() => {
    const seen = new Set();
    return allData
      .filter((d) => {
        if (seen.has(d.catCode)) return false;
        seen.add(d.catCode);
        return true;
      })
      .map((d, idx) => ({ value: d.catCode, label: d.catName, idx }));
  }, [allData]);

  // Item options filtered by selected category
  const itemOptions = useMemo(() => {
    if (!selection.categoryCode) return [];
    return allData
      .filter((d) => d.catCode === selection.categoryCode)
      .map((d, idx) => ({ value: `${d.itemId}-${idx}`, itemId: d.itemId, label: d.itemName, raw: d }));
  }, [allData, selection.categoryCode]);

  const fetchData = useCallback(async () => {
    if (!apiBaseUrl) return;
    setLoading(true);
    setError("");
    try {
      const api = createApiInstance(apiBaseUrl);
      const res = await api.get(ENDPOINTS.CATEGORY_SEARCH);
      setAllData(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.log("[CategorySelectModal] fetch failed:", e.message);
      setError("Couldn't load categories");
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    if (!visible) return;
    setSelection({ ...DEFAULT_SELECTION, ...(initialValue || {}) });
    fetchData();
  }, [visible, initialValue]);

  const handleSelectCategory = (option) => {
    const itemsUnderCat = allData.filter((d) => d.catCode === option.value);
    const firstItem = itemsUnderCat[0] || {};
    const autoItem = itemsUnderCat.length === 1 ? firstItem : null;
    setSelection((prev) => ({
      ...prev,
      category: option.label,
      categoryCode: option.value,
      itemType: firstItem.itemTypeName || option.label,
      itemTypeId: firstItem.itemTypeId || "",
      metalId: firstItem.metalId || "",
      item: autoItem ? autoItem.itemName : "",
      itemId: autoItem ? autoItem.itemId : "",
      subItemId: autoItem ? (autoItem.subItemId || "") : "",
      purity: autoItem && autoItem.purity != null ? String(autoItem.purity) : "",
      prate: autoItem && autoItem.prate != null ? String(autoItem.prate) : "",
    }));
  };

  const handleSelectItem = (option) => {
    const raw = option.raw || {};
    setSelection((prev) => ({
      ...prev,
      item: option.label,
      itemId: option.itemId,
      subItemId: raw.subItemId || "",
      metalId: raw.metalId || prev.metalId,
      itemType: raw.itemTypeName || prev.itemType,
      itemTypeId: raw.itemTypeId || prev.itemTypeId,
      purity: raw.purity != null ? String(raw.purity) : prev.purity,
      prate: raw.prate != null ? String(raw.prate) : prev.prate,
    }));
  };

  const handleDone = () => onDone(selection);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderBar}>
                <Text style={styles.modalHeaderText}>BillPurchaseDetail</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeIconBtn}>
                  <Text style={styles.closeIconText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
                <DropdownField
                  label="Category"
                  value={selection.category}
                  options={categoryOptions}
                  onSelect={handleSelectCategory}
                  styles={styles}
                  theme={theme}
                  loading={loading}
                />
                {!!error && <Text style={styles.fieldErrorText}>{error}</Text>}

                <DropdownField
                  label="Item"
                  value={selection.item}
                  options={itemOptions}
                  onSelect={handleSelectItem}
                  styles={styles}
                  theme={theme}
                  disabled={!selection.categoryCode}
                  placeholder={selection.categoryCode ? "Select" : "Select a category first"}
                />

                <DropdownField
                  label="Sub Item"
                  value={selection.subItem}
                  options={[]}
                  onSelect={() => {}}
                  styles={styles}
                  theme={theme}
                  disabled
                  placeholder="Not available"
                />

                {/* Item Type — read-only, mirrors category */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Item Type</Text>
                  <View style={[styles.dropdownField, styles.dropdownFieldDisabled]}>
                    <Text style={styles.dropdownFieldText} numberOfLines={1}>
                      {selection.itemType || "Select a category first"}
                    </Text>
                  </View>
                </View>

                {/* Ownership */}
                <View style={styles.ownershipRow}>
                  {OWNERSHIP_OPTIONS.map((option) => {
                    const isActive = selection.ownership.includes(option.key);
                    return (
                      <TouchableOpacity
                        key={option.key}
                        style={styles.ownershipOption}
                        onPress={() =>
                          setSelection((prev) => ({
                            ...prev,
                            ownership: toggleOwnership(prev.ownership, option.key, option.group),
                          }))
                        }
                        activeOpacity={0.7}
                      >
                        <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
                          {isActive && <View style={styles.radioDot} />}
                        </View>
                        <Text style={styles.ownershipLabel}>{option.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Description</Text>
                  <TextInput
                    style={styles.descriptionInput}
                    value={selection.description}
                    onChangeText={(text) =>
                      setSelection((prev) => ({ ...prev, description: text }))
                    }
                    placeholder="Enter description"
                    placeholderTextColor={theme.COLORS.placeholder}
                    onSubmitEditing={handleDone}
                    returnKeyType="done"
                  />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.8}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CategorySelectModal;
