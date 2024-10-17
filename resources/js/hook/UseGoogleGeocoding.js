import { useState } from 'react';
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
    const fetchCoordinates = async (address) => {
        try {
            const response = await axios.post('/geocode', { address });
            setCoordinates({
                longitude: response.data.longitude,
                latitude: response.data.latitude
            })
            console.log("Coordenadas: " + coordinates.latitude + coordinates.longitude)

        } catch (error) {
            console.error('Erro ao buscar coordenadas:', error);
        }
    };
    

    return { coordinates, fetchCoordinates, error };
};

export default useGoogleGeocoding;
