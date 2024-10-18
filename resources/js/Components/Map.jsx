import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import PropTypes from 'prop-types';

const containerStyle = {
    width: '100%',
    height: '100%',
};

export default function Map({ center, selectedContact }) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
    });

    const mapRef = useRef(null);

    const onLoad = (map) => {
        mapRef.current = map;
    };

    const onUnmount = () => {
        mapRef.current = null;
    };

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.panTo(center);
        }
    }, [center]);

    if (loadError) {
        return <div>Erro ao carregar o mapa</div>;
    }

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={selectedContact ? 14 : 8}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            {selectedContact && (
                <Marker
                    position={{ lat: parseFloat(selectedContact.latitude), lng: parseFloat(selectedContact.longitude) }}
                    title={selectedContact.nome}
                />
            )}

            {!selectedContact && center.lat !== 0 && center.lng !== 0 && (
                <Marker
                    position={center}
                    title="Sua localização"
                    icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    }}
                />
            )}
        </GoogleMap>
    ) : (
        <div>Carregando o mapa...</div>
    );
}

Map.propTypes = {
    center: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }).isRequired,
    selectedContact: PropTypes.shape({
        latitude: PropTypes.string.isRequired,
        longitude: PropTypes.string.isRequired,
        nome: PropTypes.string.isRequired,
    }),
};

Map.defaultProps = {
    selectedContact: null,
};
