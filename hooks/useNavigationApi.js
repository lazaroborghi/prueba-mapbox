import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook para interactuar con la API de Mapbox Directions
const useNavigationApi = ({ origin, destination, token, geometries = 'geojson' }) => {
  // Estados para almacenar la información de la ruta, errores y estado de carga
  const [coordinates, setCoordinates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Función asincrónica para obtener la ruta desde la API
    const fetchRoute = async () => {
      setLoading(true);
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?access_token=${token}&geometries=${geometries}`;
        const response = await axios.get(url);
        const coords = response.data.routes[0].geometry.coordinates;
        const time = response.data.routes[0].duration;
        const dist = response.data.routes[0].distance;
        
        // Actualizamos los estados
        setCoordinates(coords);
        setEstimatedTime(time);
        setDistance(dist);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [origin, destination, token, geometries]);

  return { coordinates, error, loading, estimatedTime, distance };
};

export default useNavigationApi;
