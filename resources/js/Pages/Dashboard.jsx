import React, { useState, useEffect, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Helmet } from 'react-helmet'; 
import { ToastContainer, toast } from 'react-toastify';
import Map from '@/Components/Map';
import useGeolocation from '@/hook/UseGeolocation';
import AddContactButton from '@/Components/AddContactButton';
import AddContactModal from '@/Components/AddContactModal';
import debounce from 'lodash/debounce';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() { 
    const { location } = useGeolocation();
    const [selectedContact, setSelectedContact] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialContacts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/contacts');
                setContacts(response.data.contacts || []);
            } catch (err) {
                toast.error('Erro ao carregar contatos.');
                setError('Erro ao carregar contatos.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialContacts();
    }, []);

    /**
     * Lida com a seleção de um contato na lista.
     * @param {Object} contact - Contato selecionado.
     */
    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    /**
     * Adiciona um novo contato à lista de contatos.
     * @param {Object} newContact - O novo contato a ser adicionado.
     */
    const addContact = (newContact) => {
        if (newContact && newContact.id) {
            setContacts(prevContacts => [...prevContacts, newContact]);
            toast.success('Contato adicionado com sucesso.');
            setSuccess('Contato adicionado com sucesso.');
            setTimeout(() => setSuccess(''), 3000); // Limpa a mensagem após 3 segundos
        } else {
            console.error('Tentativa de adicionar um contato inválido:', newContact);
            toast.error('Contato inválido.');
            setError('Contato inválido.');
        }
    };

    /**
     * Envia a requisição de busca ao backend com debounce usando axios.
     */
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            setLoading(true);
            try {
                const response = await axios.get('/contacts', {
                    params: { search: query },
                });
                console.log('Resposta da busca:', response.data.contacts); // Para depuração
                setContacts(response.data.contacts || []);
            } catch (err) {
                console.error('Erro ao buscar contatos:', err);
                toast.error('Erro ao buscar contatos.');
                setError('Erro ao buscar contatos.');
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    /**
     * Lida com a mudança no campo de pesquisa.
     * @param {Event} e - Evento de mudança.
     */
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        debouncedSearch(query);
    };

    const mapCenter = selectedContact 
        ? { lat: parseFloat(selectedContact.latitude), lng: parseFloat(selectedContact.longitude) }
        : (location || { lat: 0, lng: 0 });

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <ToastContainer />

            {success && <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">{success}</div>}
            {error && <p className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</p>}
            <div className='h-screen flex'>
                <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Contatos</h2>
                    
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Pesquisar por nome ou CPF"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                        {loading && <p className="text-sm text-gray-500">Buscando...</p>}
                    </div>

                    <AddContactButton onClick={openModal} />
                    <ul>
                        {contacts.length > 0 ? (
                            contacts.map(contact => (
                                <li
                                    key={contact.id}
                                    className={`p-2 mb-2 rounded cursor-pointer ${
                                        selectedContact && selectedContact.id === contact.id
                                            ? 'bg-blue-200'
                                            : 'bg-white hover:bg-blue-100'
                                    }`}
                                    onClick={() => handleSelectContact(contact)}
                                >
                                    <p className="font-bold">{contact.nome}</p>
                                    <p className="text-sm text-gray-600">{contact.cpf}</p>
                                    <p className="text-sm text-gray-600">{contact.telefone}</p>
                                    <p className="text-sm text-gray-600">Endereço: {contact.endereco}</p>
                                    {contact.complemento ? (
                                        <p className="text-sm text-gray-600">Complemento: {contact.complemento}</p>

                                    ): (
                                        <p className="text-sm text-gray-600">Nenhum complemento</p>

                                    )}

                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">Nenhum contato encontrado.</li>
                        )}
                    </ul>
                </div>

                <div className='w-3/4 h-full'>
                    <Map 
                        center={mapCenter}
                        selectedContact={selectedContact}
                    />
                </div>
            </div>

            <AddContactModal isOpen={isModalOpen} onClose={closeModal} onAddContact={addContact} />
        </AuthenticatedLayout>
    );
}
