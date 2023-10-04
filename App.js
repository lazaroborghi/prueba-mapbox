import React from 'react';
import { StyleSheet, View } from 'react-native';
import Map from './components/Map.js'

const App = () => {
  
  return (
      <View style={styles.page}>
          <Map/>
      </View>
  );
}

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    height: '100%',
    width: '100%',
  }
});