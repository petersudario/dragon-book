import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useViaCep from '@/hooks/useViaCep';
import useGoogleGeocoding from '@/hooks/useGoogleGeocoding';
import InputMask from 'react-input-mask'; 

export default function AddContactForm ({ onCancel, onAddContact }) {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        telefone: '',
        cep: '',
        endereco: '',
        latitude: '',
        longitude: '',
        complemento: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { address, fetchAddress, error: cepError } = useViaCep();
    const { coordinates, fetchCoordinates, error: geoError } = useGoogleGeocoding(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

    // Atualiza o campo de endereço quando os dados do ViaCep são obtidos
    useEffect(() => {
        if (address.logradouro || address.bairro || address.localidade || address.uf) {
            const enderecoCompleto = `${address.logradouro}, ${address.bairro}, ${address.localidade} - ${address.uf}`;
            setFormData(prevData => ({ ...prevData, endereco: enderecoCompleto }));

            // Buscar coordenadas com base no endereço completo
            if (address.logradouro && address.bairro && address.localidade && address.uf) {
                const fullAddress = `${address.logradouro}, ${address.bairro}, ${address.localidade}, ${address.uf}, Brasil`;
                fetchCoordinates(fullAddress);
            }
        }
    }, [address]);

    // Atualiza latitude e longitude quando as coordenadas são obtidas
    useEffect(() => {
        if (coordinates.latitude && coordinates.longitude) {
            setFormData(prevData => ({
                ...prevData,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            }));
        }
    }, [coordinates]);

    // Lida com a mudança nos campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
    
        try {
            const { data } = await axios.post('/contacts', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (data.contact) {
                onAddContact(data.contact);
                onCancel();
            } else {
                setErrors({ form: 'O contato foi criado, mas os dados estão ausentes.' });
            }
        } catch (error) {
            const { errors, error: formError } = error.response?.data || {};
    
            if (errors) {
                setErrors(errors);
            } else if (formError) {
                setErrors({ form: formError });
            } else {
                setErrors({ form: 'Ocorreu um erro ao adicionar o contato.' });
            }
        } finally {
            setLoading(false);
        }
    };
    

    // Lida com o evento de perda de foco no campo CEP para buscar o endereço
    const handleCepBlur = () => {
        const sanitizedCep = formData.cep.replace(/\D/g, '');
        if (sanitizedCep.length === 8) { // CEP brasileiro tem 8 dígitos
            fetchAddress(formData.cep);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.form && <div className="mb-4 text-red-500">{errors.form}</div>}
            <div className="mb-4">
                <label htmlFor="nome" className="block text-gray-700">Nome:</label>
                <input
                    type="text"
                    name="nome"
                    id="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
                {errors.nome && <span className="text-red-500 text-sm">{errors.nome}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor="cpf" className="block text-gray-700">CPF:</label>
                <InputMask
                    mask="999.999.999-99"
                    name="cpf"
                    id="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                >
                    {(inputProps) => (
                        <input
                            type="text"
                            {...inputProps}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    )}
                </InputMask>
                {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor="telefone" className="block text-gray-700">Telefone:</label>
                <InputMask
                    mask="(99) 99999-9999"
                    name="telefone"
                    id="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                >
                    {(inputProps) => (
                        <input
                            type="text"
                            {...inputProps}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    )}
                </InputMask>
                {errors.telefone && <span className="text-red-500 text-sm">{errors.telefone}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor="cep" className="block text-gray-700">CEP:</label>
                <InputMask
                    mask="99999-999"
                    name="cep"
                    id="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    onBlur={handleCepBlur}
                >
                    {(inputProps) => (
                        <input
                            type="text"
                            {...inputProps}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    )}
                </InputMask>
                {errors.cep && <span className="text-red-500 text-sm">{errors.cep}</span>}
                {cepError && <span className="text-red-500 text-sm">{cepError}</span>}
            </div>

            <div className="mb-4">
                <label htmlFor="endereco" className="block text-gray-700">Endereço:</label>
                <input
                    type="text"
                    name="endereco"
                    id="endereco"
                    value={formData.endereco || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded bg-gray-200"
                    readOnly
                    required
                />
                {errors.endereco && <span className="text-red-500 text-sm">{errors.endereco}</span>}
                {geoError && <span className="text-red-500 text-sm">{geoError}</span>}
            </div>

            <input type="hidden" name="latitude" value={formData.latitude} />
            <input type="hidden" name="longitude" value={formData.longitude} />

            <div className="mb-4">
                <label htmlFor="complemento" className="block text-gray-700">Complemento (Opcional):</label>
                <input
                    type="text"
                    name="complemento"
                    id="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                />
                {errors.complemento && <span className="text-red-500 text-sm">{errors.complemento}</span>}
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </form>
    )
}
