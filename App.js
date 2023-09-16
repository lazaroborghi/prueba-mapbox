import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import Map from './components/Map.js'
import Modal from './components/Modal.js'

const App = () => {
  return (
    <GestureHandlerRootView style={styles.page}>
      <View style={styles.container}>
        <Map/>
        <Modal/>
      </View>
    </GestureHandlerRootView>
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