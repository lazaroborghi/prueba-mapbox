import React from 'react';
import { StyleSheet, View } from 'react-native';
import Map from './components/Map.js'

const App = () => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Map/>
      </View>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  }
});