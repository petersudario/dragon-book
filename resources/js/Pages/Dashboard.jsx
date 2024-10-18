import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { Helmet } from 'react-helmet'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Map from '@/Components/Map';
import AddContactButton from '@/Components/AddContactButton';
import AddContactModal from '@/Components/AddContactModal';
import useGeolocation from '@/hook/UseGeolocation';
import { Head } from '@inertiajs/react';

const CONTACTS_API_ENDPOINT = '/contacts';
const DEBOUNCE_DELAY = 500;
const NOTIFICATION_TIMEOUT = 3000;

export default function Dashboard() {

  // Hooks de localização
  const { location } = useGeolocation();

  // Estados locais
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    success: '',
    error: '',
  });

  // Função para buscar contatos
  const fetchContacts = useCallback(async (page = 1, query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(CONTACTS_API_ENDPOINT, {
        params: { page, search: query },
      });
      const { contacts: fetchedContacts, current_page, last_page } = response.data;
      
      setContacts(fetchedContacts || []);
      setPagination({ currentPage: current_page, lastPage: last_page });
    } catch (err) {
      const errorMessage = 'Erro ao carregar contatos.';
      toast.error(errorMessage);
      setNotification(prev => ({ ...prev, error: errorMessage }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Efeito para buscar contatos na montagem do componente
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Handler para seleção de contato
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  // Handlers para modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handler para adicionar um novo contato
  const addContact = (newContact) => {
    if (newContact?.id) {
      fetchContacts(pagination.currentPage, searchTerm);
      const successMessage = 'Contato adicionado com sucesso.';
      toast.success(successMessage);
      setNotification({ success: successMessage, error: '' });
      setTimeout(() => setNotification(prev => ({ ...prev, success: '' })), NOTIFICATION_TIMEOUT);
    } else {
      const errorMessage = 'Contato inválido.';
      toast.error(errorMessage);
      setNotification({ success: '', error: errorMessage });
    }
  };

  // Função debounced para busca
  const debouncedSearch = useCallback(
    debounce((query) => {
      fetchContacts(1, query);
    }, DEBOUNCE_DELAY),
    [fetchContacts]
  );

  // Handler para mudanças no campo de busca
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };

  // Handler para mudança de página
  const handlePageChange = (newPage) => {
    fetchContacts(newPage, searchTerm);
  };

  // Calcula o centro do mapa
  const getMapCenter = () => {
    if (selectedContact) {
      const { latitude, longitude } = selectedContact;
      return { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    }
    return location || { lat: 0, lng: 0 };
  };

  return (
    <AuthenticatedLayout>
        <Head title="Dashboard" />

      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <ToastContainer />
      
      {notification.success && (
        <div className="mb-4 p-2 bg-green-200 text-green-800 rounded">
          {notification.success}
        </div>
      )}
      
      {notification.error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          {notification.error}
        </div>
      )}
      
      <div className="h-screen flex">
        <aside className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
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

          <ul className="mt-4">
            {contacts.length > 0 ? (
              contacts.map(contact => (
                <li
                  key={contact.id}
                  className={`p-2 mb-2 rounded cursor-pointer ${
                    selectedContact?.id === contact.id
                      ? 'bg-blue-200'
                      : 'bg-white hover:bg-blue-100'
                  }`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <p className="font-bold">{contact.nome}</p>
                  <p className="text-sm text-gray-600">CPF: {contact.cpf}</p>
                  <p className="text-sm text-gray-600">Telefone: {contact.telefone}</p>
                  <p className="text-sm text-gray-600">Endereço: {contact.endereco}</p>
                  <p className="text-sm text-gray-600">
                    Complemento: {contact.complemento || 'Nenhum complemento'}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Nenhum contato encontrado.</li>
            )}
          </ul>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 rounded ${
                pagination.currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Anterior
            </button>
            <span>
              Página {pagination.currentPage} de {pagination.lastPage}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.lastPage}
              className={`px-3 py-1 rounded ${
                pagination.currentPage === pagination.lastPage
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Próximo
            </button>
          </div>
        </aside>

        <main className="w-3/4 h-full">
          <Map 
            center={getMapCenter()}
            selectedContact={selectedContact}
          />
        </main>
      </div>

      <AddContactModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddContact={addContact}
      />
    </AuthenticatedLayout>
  );
};

