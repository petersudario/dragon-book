import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Hook personalizado para obter latitude e longitude com base no endereço usando a API Google Geocoding.
 *
 * @param {string} googleApiKey - A chave da API Google Geocoding.
 * @returns {Object} - Contém a função `fetchCoordinates` e os dados de coordenadas.
 */
const useGoogleGeocoding = (googleApiKey) => {
    const [coordinates, setCoordinates] = useState({ latitude: '', longitude: '' });
    const [error, setError] = useState(null);

    /**
     * Busca as coordenadas geográficas com base no endereço informado.
     *
     * @param {string} address - O endereço completo para geocodificação.
     */
    const fetchCoordinates = useCallback(async (address) => {
        try {
            const response = await axios.post('/geocode', {
                address                }
            );

            setCoordinates({
                latitude: response.data.latitude,
                longitude: response.data.longitude
            });
            setError(null);
        } catch (error) {
            console.error('Erro ao buscar coordenadas:', error);
            setCoordinates({ latitude: '', longitude: '' });
            setError(error.message || 'Erro ao buscar coordenadas.');
        }
    }, [googleApiKey]); // Depende da chave da API

    return { coordinates, fetchCoordinates, error };
};

export default useGoogleGeocoding;
