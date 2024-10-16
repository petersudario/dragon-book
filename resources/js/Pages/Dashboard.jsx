import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Map from '@/Components/Map';
import { Head } from '@inertiajs/react';
import useGeolocation from '@/hook/UseGeolocation';
import { useState } from 'react';

export default function Dashboard({ contacts }) { 
    const { location, error } = useGeolocation();
    const [selectedContact, setSelectedContact] = useState(null);

    const handleSelectContact = (contact) => {
        setSelectedContact(contact);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            {error && <p className="error">Erro de geolocalização: {error}</p>}
            <div className='h-screen flex'>
                <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Contatos</h2>
                    <ul>
                        {contacts.map(contact => (
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
                        ))}
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
        </AuthenticatedLayout>
    );
}
