// useNavigationApi.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useNavigationApi = ({ origin, destination, token, deviceCoordinates, navigationMode }) => {
  const [routeData, setRouteData] = useState({
    coordinates: [],
    estimatedTime: null,
    distance: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!origin || !destination || !token || !navigationMode) return; 

    const fetchRoute = async () => {
      setRouteData(prev => ({ ...prev, loading: true }));

      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?access_token=${token}&geometries=geojson`;
        const response = await axios.get(url);

        setRouteData({
          coordinates: response.data.routes[0].geometry.coordinates,
          estimatedTime: response.data.routes[0].duration,
          distance: response.data.routes[0].distance,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error(err);
        setRouteData({
          coordinates: [],
          estimatedTime: null,
          distance: null,
          loading: false,
          error: err
        });
      }
    };

    fetchRoute();
  }, [origin, destination, token, deviceCoordinates, navigationMode]);

  return routeData;
};

export default useNavigationApi;
