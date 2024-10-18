// resources/js/Components/EditContactForm.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask'; 
import { toast } from 'react-toastify';
import useViaCep from '@/hooks/useViaCep';
import useGoogleGeocoding from '@/hooks/useGoogleGeocoding';

export default function EditContactForm({ contact, onCancel, onUpdateContact }) {
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
    const { coordinates, fetchCoordinates, error: geoError } = useGoogleGeocoding(import.meta.env.VITE_GOOGLE_MAPS_API_KEY); // Substitua pela sua chave

    // Preenche o formulário com os dados do contato ao receber a prop
    useEffect(() => {
        if (contact) {
            setFormData({
                nome: contact.nome || '',
                cpf: contact.cpf || '',
                telefone: contact.telefone || '',
                cep: contact.cep || '',
                endereco: contact.endereco || '',
                latitude: contact.latitude || '',
                longitude: contact.longitude || '',
                complemento: contact.complemento || '',
            });

            // Busca o endereço baseado no CEP
            if (contact.cep) {
                fetchAddress(contact.cep);
            }
        }
    }, [contact, fetchAddress]);

    // Atualiza o campo de endereço quando os dados do ViaCep são obtidos
    useEffect(() => {
        if (address.logradouro || address.bairro || address.localidade || address.uf) {
            const enderecoCompleto = `${address.logradouro}, ${address.bairro}, ${address.localidade} - ${address.uf}`;
            // Verifica se o endereço realmente mudou antes de atualizar
            if (formData.endereco !== enderecoCompleto) {
                setFormData(prevData => ({ ...prevData, endereco: enderecoCompleto }));
            }

            // Busca coordenadas com base no endereço completo
            if (address.logradouro && address.bairro && address.localidade && address.uf) {
                const fullAddress = `${address.logradouro}, ${address.bairro}, ${address.localidade}, ${address.uf}, Brasil`;
                fetchCoordinates(fullAddress);
            }
        }
    }, [address, fetchCoordinates, formData.endereco]);

    // Atualiza latitude e longitude quando as coordenadas são obtidas
    useEffect(() => {
        if (coordinates.latitude && coordinates.longitude) {
            // Verifica se as coordenadas realmente mudaram antes de atualizar
            if (formData.latitude !== coordinates.latitude || formData.longitude !== coordinates.longitude) {
                setFormData(prevData => ({
                    ...prevData,
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                }));
            }
        }
    }, [coordinates, formData.latitude, formData.longitude]);

    // Lida com erros de CEP e Geocoding
    useEffect(() => {
        if (cepError) {
            toast.error(cepError);
        }
        if (geoError) {
            toast.error(geoError);
        }
    }, [cepError, geoError]);

    // Lida com a mudança nos campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        // Se o campo alterado for o CEP, buscar o endereço
        if (name === 'cep') {
            fetchAddress(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await axios.put(`/contacts/${contact.id}`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data.contact) {
                onUpdateContact(response.data.contact);
                onCancel();
            } else {
                setErrors({ form: 'O contato foi atualizado, mas os dados estão ausentes.' });
                toast.error('O contato foi atualizado, mas os dados estão ausentes.');
            }
        } catch (error) {
            const { errors, message } = error.response?.data || {};
            if (errors) {
                setErrors(errors);
                Object.values(errors).forEach(errMsg => toast.error(errMsg));
            } else if (message) {
                setErrors({ form: message });
                toast.error(message);
            } else {
                setErrors({ form: 'Ocorreu um erro ao atualizar o contato.' });
                toast.error('Ocorreu um erro ao atualizar o contato.');
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
