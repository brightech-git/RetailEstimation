import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../Screens/Home/HomeStyles";

/* 🔹 FILTER INPUT */
export const FilterInput = ({ label, value, onChangeText, placeholder }) => (
  <View style={styles.filterInputContainer}>
    <Text style={styles.filterLabel}>{label}</Text>
    <TextInput
      style={styles.filterInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
    />
  </View>
);

/* 🔹 MODE TOGGLE */
export const ModeToggle = ({ mode, setMode }) => (
  <View style={styles.modeToggle}>
    <TouchableOpacity
      style={styles.modeOption}
      onPress={() => setMode("automatic")}
    >
      <Ionicons
        name={mode === "automatic" ? "radio-button-on" : "radio-button-off"}
        size={20}
        color="#1C467C"
      />
      <Text style={styles.modeText}>Automatic</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.modeOption}
      onPress={() => setMode("manual")}
    >
      <Ionicons
        name={mode === "manual" ? "radio-button-on" : "radio-button-off"}
        size={20}
        color="#1C467C"
      />
      <Text style={styles.modeText}>Manual</Text>
    </TouchableOpacity>
  </View>
);

/* 🔹 MANUAL INPUT FORM — NOW WITH UPDATE BUTTON */
export const ManualInputForm = ({
  formData,
  setFormData,
  onSubmitUpdate, // <-- new handler
}) => (
  <View style={styles.manualContainer}>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Item-Tag</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Input Box */}
        <TextInput
          style={[styles.textInput, { flex: 1 }]}
          placeholder="Enter ItemID-TagNo (e.g. 23-23458)"
          value={formData.scannedData}
          onChangeText={(text) => setFormData({ scannedData: text })}
        />

        {/* UPDATE BUTTON */}
        <TouchableOpacity
          onPress={onSubmitUpdate}
          style={{
            backgroundColor: "#1C467C",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 6,
            marginLeft: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>UPDATE</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

/* 🔹 FILTER ACTION BUTTONS */
export const FilterButtons = ({ onApplyFilter, onShowAll }) => (
  <View style={styles.filterButtons}>
    <TouchableOpacity style={styles.viewButton} onPress={onApplyFilter}>
      <Text style={styles.viewButtonText}>APPLY FILTER</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.clearButton} onPress={onShowAll}>
      <Text style={styles.clearButtonText}>ALL</Text>
    </TouchableOpacity>
  </View>
);

/* 🔹 AUTOMATIC SCAN BUTTON */
export const AutomaticScan = ({ onScanPress }) => (
  <View style={styles.automaticContainer}>
    <TouchableOpacity onPress={onScanPress} style={styles.scanButton}>
      <Ionicons name="scan" size={34} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.scanText}>Scan Now</Text>
  </View>
);

/* 🔹 TABLE VIEW (FIRST 10 RECORDS) */
export const ItemTagsTable = ({ itemTags }) => (
  <View>
    {/* Table Header */}
    <View style={styles.tableHeader}>
      <Text style={[styles.headerCell, { width: 40 }]}>ItemID</Text>
      <Text style={[styles.headerCell, { width: 80 }]}>Tag No</Text>
      <Text style={[styles.headerCell, { width: 55 }]}>PCS</Text>
      <Text style={[styles.headerCell, { width: 80 }]}>Gross Wt</Text>
      <Text style={[styles.headerCell, { width: 80 }]}>Net Wt</Text>
      <Text style={[styles.headerCell, { width: 120 }]}>Rec Date</Text>
      <Text style={[styles.headerCell, { width: 120 }]}>Item Name</Text>
      <Text style={[styles.headerCell, { width: 140 }]}>SubItem</Text>
      <Text style={[styles.headerCell, { width: 140 }]}>Counter</Text>
      <Text style={[styles.headerCell, { width: 140 }]}>ITEMTYPE</Text>
    </View>

    {/* Table Data */}
    <FlatList
      data={itemTags.slice(0, 10)}
      keyExtractor={(item) => `${item.TAGNO}-${item.ITEMID}`}
      renderItem={({ item }) => (
        <View style={styles.tableRow}>
          <Text style={[styles.rowCell, { width: 40 }]}>{item.ITEMID}</Text>
          <Text style={[styles.rowCell, { width: 80 }]}>{item.TAGNO}</Text>
          <Text style={[styles.rowCell, { width: 55 }]}>{item.PCS}</Text>
          <Text style={[styles.rowCell, { width: 80 }]}>{item.GRSWT}</Text>
          <Text style={[styles.rowCell, { width: 80 }]}>{item.NETWT}</Text>
          <Text style={[styles.rowCell, { width: 120 }]}>
            {item.RECDATE?.split(" ")[0] || ""}
          </Text>
          <Text style={[styles.rowCell, { width: 120 }]}>{item.ITEMNAME}</Text>
          <Text style={[styles.rowCell, { width: 140 }]}>
            {item.SUBITEMNAME}
          </Text>
          <Text style={[styles.rowCell, { width: 140 }]}>
            {item.COUNTERNAME}
          </Text>
          <Text style={[styles.rowCell, { width: 140 }]}>
            {item.ITEMTYPENAME}
          </Text>
        </View>
      )}
    />
  </View>
);
