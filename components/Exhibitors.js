import React, { useState } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { expositores } from '../assets/expositores.js';
import fairStand from '../assets/fair-stand.png';
import ExhibitorItem from './ExhibitorItem.js';
import SearchBar from './SearchBar.js';

export default function Exhibitors() {
  const [searchText, setSearchText] = useState('');
  const handleScroll = () => {
    Keyboard.dismiss();
  };

  const filteredExpositores = expositores.expositores.filter((exp) =>
    exp.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => <ExhibitorItem item={item} fairStand={fairStand} />;

  return (
    <View style={styles.container}>
      <SearchBar placeholder="Buscar expositores" onSearchTextChange={(text) => setSearchText(text)} />
      <BottomSheetFlatList
        data={filteredExpositores}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onScroll={handleScroll}
        style={styles.bottomSheetFlatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  bottomSheetFlatListContainer: {
    flex: 1,
    width: '100%',
  },
});
