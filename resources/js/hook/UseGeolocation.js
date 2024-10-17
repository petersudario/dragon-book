import { useState, useEffect } from 'react';

/**
 * Hook personalizado para obter a localização atual do usuário.
 *
 * @returns {Object} - Contém a localização (`location`) e possíveis erros (`error`).
 */
const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Callback para quando a geolocalização for bem-sucedida.
   *
   * @param {GeolocationPosition} position
   */
  const onSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ lat: latitude, lng: longitude });
  };

  /**
   * Callback para quando ocorrer um erro na geolocalização.
   *
   * @param {GeolocationPositionError} error
   */
  const onError = (error) => {
    setError(error.message);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return { location, error };
};

export default useGeolocation;
