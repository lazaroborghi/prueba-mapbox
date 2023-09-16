import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Button } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import useNavigationApi from '../hooks/useNavigationApi.js';
import MapNavigation from './MapNavigation.js';
import MapNormal from './MapNormal.js';

Mapbox.setAccessToken('sk.eyJ1IjoibGF6YXJvYm9yZ2hpIiwiYSI6ImNsbTczaW5jdzNncGgzam85bjdjcDc3ZnQifQ.hhdcu0s0SZ2gm_ZHQZ4h7A');

const Map = () => {
  const [navigationMode, setNavigationMode] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);
  const [deviceCoordinates, setDeviceCoordinates] = useState(null);
  const cameraRef = useRef(null);

  const exhibitors = [
    { id: 1, name: 'Expositor 1', latitude: -34.9011, longitude: -56.1634 },
    { id: 2, name: 'Expositor 2', latitude: -34.9055, longitude: -56.1644 },
    { id: 3, name: 'Expositor 3', latitude: -34.9037, longitude: -56.1654 },
    { id: 4, name: 'Expositor 4', latitude: -34.9045, longitude: -56.1695 },
    { id: 5, name: 'John Deere', latitude: -33.44854, longitude: -57.90889 },
    { id: 6, name: 'Brou', latitude: -33.44899, longitude: -57.90910 },
    { id: 7, name: 'Acodike', latitude: -33.44983, longitude: -57.90662 }
  ];

  const navigationConfig = {
    origin: deviceCoordinates,
    destination: selectedExhibitor,
    token: 'sk.eyJ1IjoibGF6YXJvYm9yZ2hpIiwiYSI6ImNsbTczaW5jdzNncGgzam85bjdjcDc3ZnQifQ.hhdcu0s0SZ2gm_ZHQZ4h7A',
  };

  const { coordinates, error, loading, estimatedTime, distance } = useNavigationApi(navigationConfig);

  const selectExhibitor = (exhibitor) => {
    setDeviceCoordinates({ latitude: -33.44867, longitude: -57.90756 });
    setSelectedExhibitor(exhibitor);
  };

  const toggleNavigation = () => {
    setNavigationMode(!navigationMode);
    navigationMode && setSelectedExhibitor(null);
  };

  const onMapPress = () => {
    setSelectedExhibitor(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView style={{ flex: 1 }} onPress={onMapPress}>
        <Mapbox.Camera
          ref={cameraRef}
          centerCoordinate={[exhibitors[0].longitude, exhibitors[0].latitude]}
          zoomLevel={15}
        />
        <Mapbox.MarkerView
          id="device"
          coordinate={[-57.90756, -33.44867]}
        >
          <View style={{ backgroundColor: 'blue', padding: 5 }}>
            <Text style={{ color: 'white' }}>Dispositivo</Text>
          </View>
        </Mapbox.MarkerView>
        {exhibitors.map((exhibitor) => (
          <Mapbox.MarkerView
            key={exhibitor.id}
            id={String(exhibitor.id)}
            coordinate={[exhibitor.longitude, exhibitor.latitude]}
          >
            <TouchableOpacity onPress={() => selectExhibitor(exhibitor)}>
              <View style={{ backgroundColor: 'darkgreen', padding: 5 }}>
                <Text style={{ color: 'white' }}>{exhibitor.name}</Text>
              </View>
              {selectedExhibitor && selectedExhibitor.id === exhibitor.id && (
                <Mapbox.Callout
                  // Aquí puedes ajustar la posición si es necesario
                  title={`Distancia: ${distance}, Tiempo: ${estimatedTime}`}
                />
              )}
            </TouchableOpacity>
          </Mapbox.MarkerView>
        ))}
        {navigationMode ? (
          <MapNavigation coordinates={coordinates} cameraRef={cameraRef} />
        ) : (
          <MapNormal />
        )}
      </Mapbox.MapView>
      {selectedExhibitor && (
        <View style={{
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 1
        }}>
          <Button
            title={navigationMode ? "Cerrar" : "Ir"}
            onPress={toggleNavigation}
          />
        </View>
      )}
    </View>
  );
};

export default Map;
