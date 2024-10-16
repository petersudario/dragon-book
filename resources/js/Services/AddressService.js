import axios from 'axios';

/**
 * Busca o endereço pelo CEP.
 *
 * @param {string} cep
 * @returns {Promise<Object>}
 */
export const fetchAddressByCep = async (cep) => {
  try {
    const response = await axios.post('/api/v1/addresses', { cep });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
