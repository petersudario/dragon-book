import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Map from '@/Components/Map';
import { Head, usePage } from '@inertiajs/react';
import useGeolocation from '@/hook/UseGeolocation';
import AddContactButton from '@/Components/AddContactButton';
import AddContactModal from '@/Components/AddContactModal';

export default function Dashboard() { 
    // Renomeia 'contacts' para 'initialContacts' para evitar conflito com o estado local
    const { contacts: initialContacts, success, error } = usePage().props;
    const { location } = useGeolocation();
    const [selectedContact, setSelectedContact] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Inicializa o estado local 'contacts' com 'initialContacts' ou um array vazio
    const [contacts, setContacts] = useState(initialContacts || []);

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    /**
     * Adiciona um novo contato à lista de contatos.
     * @param {Object} newContact - O novo contato a ser adicionado.
     */
    const addContact = (newContact) => {
        if (newContact && newContact.id) { // Verifica se 'newContact' está definido e possui 'id'
            setContacts(prevContacts => [...prevContacts, newContact]);
        } else {
            console.error('Tentativa de adicionar um contato inválido:', newContact);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            {success && <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">{success}</div>}
            {error && <p className="error">Erro de geolocalização: {error}</p>}
            <div className='h-screen flex'>
                <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Contatos</h2>
                    <AddContactButton onClick={openModal} />
                    <ul>
                        {contacts && contacts.length > 0 ? (
                            contacts.map(contact => (
                                // Verifica se 'contact' está definido
                                contact && (
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
                                        <p className="text-sm text-gray-600">{contact.telefone}</p>
                                    </li>
                                )
                            ))
                        ) : (
                            <li className="text-gray-500">Nenhum contato encontrado.</li>
                        )}
                    </ul>
                </div>

                {/* Mapa */}
                <div className='w-3/4 h-full'>
                    {location ? (
                        <div className="map-container h-full">
                            <Map center={selectedContact ? {
                                lat: selectedContact.latitude,
                                lng: selectedContact.longitude
                            } : location} />
                        </div>
                    ) : (
                        <div className="map-container h-full">
                            <Map />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Adição de Contato */}
            <AddContactModal isOpen={isModalOpen} onClose={closeModal} onAddContact={addContact} />
        </AuthenticatedLayout>
    );
}
