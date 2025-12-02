import React from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { createDropdownStyles } from "./ItemListDropdownStyles";

const ItemListDropdown = ({
  theme,
  showList,
  itemList,
  setITEMID,
  setShowList,
  tagInputRef,
}) => {
  if (!showList || !itemList.length) return null;

  const styles = createDropdownStyles(theme);

  return (
    <View style={styles.dropdown}>
      <FlatList
        data={itemList}
        keyExtractor={(item, index) => `item-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setITEMID(item);
              setShowList(false);
              tagInputRef.current?.focus();
            }}
            style={styles.dropdownItem}
          >
            <Text style={styles.dropdownText}>{item}</Text>
          </TouchableOpacity>
        )}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

export default ItemListDropdown;