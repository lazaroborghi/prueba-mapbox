import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { lineString as makeLineString } from '@turf/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useNavigationApi = ({ origin, destination, token, deviceCoordinates, navigationMode }) => {
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoute = useCallback(async () => {
    if (!origin || !destination || !token || !navigationMode) return;

    setLoading(true);
    setError(null);

    const routeKey = JSON.stringify({ 
      origin: {
          latitude: origin.latitude.toFixed(6), 
          longitude: origin.longitude.toFixed(6)
      }, 
      destination: {
          latitude: destination.latitude.toFixed(6), 
          longitude: destination.longitude.toFixed(6)
      }
  });
    try {
      // Intentar recuperar la ruta desde AsyncStorage
      const storedRouteData = await AsyncStorage.getItem(routeKey);
      const currentTime = new Date().getTime();

      if (storedRouteData) {
        const { savedRoute, savedDistance, timestamp } = JSON.parse(storedRouteData);
        
        // Verificar si pasó más de un mes desde que la ruta fue almacenada
        const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
        if (currentTime - timestamp < oneMonthInMilliseconds) {
          setRoute(savedRoute);
          setDistance(savedDistance);
        } else {
          // Si pasó más de un mes, eliminar la ruta almacenada y continuar para recuperar una nueva de la API
          await AsyncStorage.removeItem(routeKey);
          throw new Error("Route is outdated, fetching a new one.");
        }
      } else {
        throw new Error("No route found, fetching a new one.");
      }
    } catch (err) {
      // En caso de error (ruta no encontrada o ruta obsoleta), solicitar una nueva ruta de la API
      const cancelTokenSource = axios.CancelToken.source();
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?access_token=${token}&geometries=geojson`;
        const response = await axios.get(url, { cancelToken: cancelTokenSource.token });
        const newRoute = makeLineString(response.data.routes[0].geometry.coordinates);
        const newDistance = response.data.routes[0].distance;

        setRoute(newRoute);
        setDistance(newDistance);

        // Almacenar la nueva ruta, distancia y una marca de tiempo en AsyncStorage
        await AsyncStorage.setItem(routeKey, JSON.stringify({
          savedRoute: newRoute,
          savedDistance: newDistance,
          timestamp: new Date().getTime() // Almacenar el tiempo actual como marca de tiempo
        }));

      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
      
      // Cancelar la solicitud si el componente se desmonta antes de que se resuelva la solicitud
      return () => cancelTokenSource && cancelTokenSource.cancel();
    } finally {
      setLoading(false);
    }
  }, [origin, destination, token, navigationMode]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute, origin, destination, token, navigationMode]);

  return {
    route,
    distance,
    loading,
    error,
    origin,
    destination,
  };
};

export default useNavigationApi;
