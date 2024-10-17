import { useState } from 'react';
import axios from 'axios';

/**
 * Hook personalizado para buscar dados de endereço com base no CEP usando a API ViaCep.
 *
 * @returns {Object} - Contém a função `fetchAddress` e os dados de endereço.
 */
const useViaCep = () => {
    const [address, setAddress] = useState({
        logradouro: '',
        bairro: '',
        localidade: '',
        uf: '',
    });
    const [error, setError] = useState(null);

    /**
     * Busca o endereço correspondente ao CEP informado.
     *
     * @param {string} cep - O CEP a ser buscado.
     */
    const fetchAddress = async (cep) => {
        try {
            const sanitizedCep = cep.replace(/\D/g, '');

            if (sanitizedCep.length !== 8) {
                throw new Error('CEP inválido.');
            }

            const response = await axios.get(`https://viacep.com.br/ws/${sanitizedCep}/json/`);

            if (response.data.erro) {
                throw new Error('CEP não encontrado.');
            }

            setAddress({
                logradouro: response.data.logradouro || '',
                bairro: response.data.bairro || '',
                localidade: response.data.localidade || '',
                uf: response.data.uf || '',
            });
            setError(null);
        } catch (err) {
            setAddress({
                logradouro: '',
                bairro: '',
                localidade: '',
                uf: '',
            });
            setError(err.message || 'Erro ao buscar o CEP.');
        }
    };

    return { address, fetchAddress, error };
};

export default useViaCep;
