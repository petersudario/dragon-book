import React, { useState } from 'react';
import { fetchAddressByCep } from '@/Services/AddressService';
import Map from '../Map';

const AddressForm = () => {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCep(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAddress(null);

    if (!/^\d{8}$/.test(cep)) {
      setError('CEP inválido! Deve conter exatamente 8 dígitos.');
      return;
    }

    try {
      const data = await fetchAddressByCep(cep);
      setAddress(data);
    } catch (err) {
      setError(err.message || 'Erro ao buscar o CEP.');
    }
  };

  return (
    <div className="address-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="cep">CEP:</label>
        <input
          type="text"
          id="cep"
          value={cep}
          onChange={handleChange}
          maxLength="8"
          placeholder="Digite o CEP"
          required
        />
        <button type="submit">Buscar</button>
      </form>

      {error && <p className="error">{error}</p>}

      {address && (
        <div className="address-details">
          <p><strong>Endereço:</strong> {address.logradouro}</p>
          <p><strong>Bairro:</strong> {address.bairro}</p>
          <p><strong>Cidade:</strong> {address.localidade}</p>
          <p><strong>Estado:</strong> {address.uf}</p>
          <Map address={address} />
        </div>
      )}
    </div>
  );
};

export default AddressForm;
