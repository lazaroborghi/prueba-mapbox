import React, { useEffect } from 'react';
import Mapbox from '@rnmapbox/maps';

const MapNavigation = ({ coordinates, cameraRef }) => {
  
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const firstCoordinate = coordinates[0];
      const lastCoordinate = coordinates[coordinates.length - 1];
      
      // Calcula los límites
      const southWest = [Math.min(firstCoordinate[0], lastCoordinate[0]), Math.min(firstCoordinate[1], lastCoordinate[1])];
      const northEast = [Math.max(firstCoordinate[0], lastCoordinate[0]), Math.max(firstCoordinate[1], lastCoordinate[1])];
      
      // Ajusta la cámara para que se ajuste a los límites
      cameraRef.current?.fitBounds(northEast, southWest, 50); // 50 es el padding
    }
  }, [coordinates]);

  return (
    <Mapbox.ShapeSource id="routeSource" shape={{ type: 'LineString', coordinates }}>
      <Mapbox.LineLayer
        id="routeLine"
        style={{
          lineWidth: 6,
          lineColor: 'blue',
          lineOpacity: 0.9,
          lineCap: 'round',
        }}
      />
    </Mapbox.ShapeSource>
  );
};

export default MapNavigation;