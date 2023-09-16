import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { AntDesign } from '@expo/vector-icons';

export default function SearchBar({ placeholder, onSearchTextChange }) {
  const [searchText, setSearchText] = useState('');

  const handleChangeText = (text) => {
    setSearchText(text);
    onSearchTextChange(text);
  };

  return (
    <View style={styles.search}>
      <View style={styles.searchWrapper}>
        <AntDesign name="search1" size={20} color="darkgreen" style={styles.searchIcon} />
        <BottomSheetTextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={searchText}
          onChangeText={handleChangeText}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => handleChangeText('')}>
            <AntDesign name="close" size={20} color="darkgreen" style={styles.closeIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    borderRadius: 15,
    width: '100%',
    height: 40,
  },
  searchIcon: {
    paddingHorizontal: 15,
  },
  closeIcon: {
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#e8e8e8',
    height: 40,
    borderRadius: 10,
    fontSize: 18,
  },
});
