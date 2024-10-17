import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Map from '@/Components/Map';
import { Head, usePage } from '@inertiajs/react';
import useGeolocation from '@/hook/UseGeolocation';
import AddContactButton from '@/Components/AddContactButton';
import AddContactModal from '@/Components/AddContactModal';

export default function Dashboard() { 
    const { contacts: initialContacts = [], success, error } = usePage().props;
    const { location } = useGeolocation();
    const [selectedContact, setSelectedContact] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [contacts, setContacts] = useState(initialContacts);

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
        } else {
            console.error('Tentativa de adicionar um contato inválido:', newContact);
        }
    };

    const mapCenter = selectedContact 
        ? { lat: parseFloat(selectedContact.latitude), lng: parseFloat(selectedContact.longitude) }
        : location;

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
                                    <p className="text-sm text-gray-600">{contact.telefone}</p>
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
