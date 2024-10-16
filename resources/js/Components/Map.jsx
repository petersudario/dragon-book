import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -23.55052,
  lng: -46.633308,
};

const Map = ({ address }) => {
  const [coordinates, setCoordinates] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const fullAddress = `${address.logradouro}, ${address.bairro}, ${address.localidade}, ${address.uf}`;

      try {
        const response = await axios.post('/api/v1/geocode', { address: fullAddress });
        setCoordinates(response.data);
      } catch (err) {
        console.error('Erro ao obter coordenadas:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchCoordinates();
    }
  }, [address]);

  if (loading) return <p>Carregando mapa...</p>;
  if (error) return <p>Erro ao carregar o mapa.</p>;

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={coordinates}
        zoom={15}
      >
        <Marker position={coordinates} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
