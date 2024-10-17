import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const defaultCenter = {
  lat: 0, // Equador
  lng: 0, // Linha de Longitude de Greenwich
};

const globalBounds = {
  north: 85,
  south: -85,
  west: -180,
  east: 180,
};

const mapOptions = {
  maxZoom: 18,
  minZoom: 5,
  restriction: {
    latLngBounds: globalBounds,
    strictBounds: true,
  },
  disableDefaultUI: false,
};

/**
 * Componente de Mapa.
 *
 * @param {Object} props
 * @param {Object} props.center - Coordenadas para centralizar o mapa.
 * @param {Object|null} props.selectedContact - Contato selecionado com latitude e longitude.
 * @returns JSX.Element
 */
export default function Map ({ center, selectedContact }){
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center || defaultCenter}
        zoom={selectedContact ? 15 : 5} 
        options={mapOptions}
      >
        {selectedContact && selectedContact.latitude && selectedContact.longitude && (
          <Marker
            position={{
              lat: parseFloat(selectedContact.latitude),
              lng: parseFloat(selectedContact.longitude),
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};


