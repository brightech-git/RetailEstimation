import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { createInputStyles } from "./InputFieldStyles";

const InputFields = ({
  theme,
  ITEMID,
  setITEMID,
  setShowList,
  fetchItemList,
  TAGNO,
  setTAGNO,
  emp,
  setEmp,
  empName,
  fetchData,
  setScanningField,
  setScannerVisible,
  itemIdInputRef,
  tagInputRef,
  empInputRef,
}) => {
  const styles = createInputStyles(theme);

  return (
    <View style={styles.inputRow}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={itemIdInputRef}
          style={styles.Iteminput}
          placeholder="Item ID"
          placeholderTextColor={theme.COLORS.placeholder}
          value={ITEMID}
          onChangeText={(text) => {
            setITEMID(text);
            setShowList(false);
          }}
          onSubmitEditing={() => {
            if (ITEMID.trim() === "") fetchItemList();
            else tagInputRef.current?.focus();
          }}
          returnKeyType="next"
        />
        <TouchableOpacity
          onPress={() => {
            setScanningField("itemid");
            setScannerVisible(true);
          }}
          style={styles.scanButton}
        >
          <Text style={styles.scanIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          ref={tagInputRef}
          style={styles.Taginput}
          placeholder="Tag No"
          placeholderTextColor={theme.COLORS.placeholder}
          value={TAGNO}
          onChangeText={setTAGNO}
          onSubmitEditing={() => empInputRef.current?.focus()}
          returnKeyType="next"
        />
        <TouchableOpacity
          onPress={() => {
            setScanningField("tagno");
            setScannerVisible(true);
          }}
          style={styles.scanButton}
        >
          <Text style={styles.scanIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          ref={empInputRef}
          style={styles.Empinput}
          placeholder="Emp ID"
          placeholderTextColor={theme.COLORS.placeholder}
          value={emp}
          onChangeText={setEmp}
          onSubmitEditing={fetchData}
          returnKeyType="done"
        />
        {!!empName && (
          <Text style={styles.empNameText}>{empName}</Text>
        )}
      </View>
    </View>
  );
};

export default InputFields;