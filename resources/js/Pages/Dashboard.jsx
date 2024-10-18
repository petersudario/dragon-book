// resources/js/Pages/Dashboard.jsx
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
import EditContactModal from '@/Components/EditContactModal';
import useGeolocation from '@/hooks/UseGeolocation';

const CONTACTS_API_ENDPOINT = '/contacts';
const DEBOUNCE_DELAY = 500;
const NOTIFICATION_TIMEOUT = 3000;

export default function Dashboard() {

  // Hooks de localização
  const { location } = useGeolocation();

  // Estados locais
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  // Handlers para modais
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  
  const openEditModal = (contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedContact(null);
    setIsEditModalOpen(false);
  };

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

  // Handler para atualizar um contato após edição
  const updateContact = (updatedContact) => {
    setContacts(prevContacts => prevContacts.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    const successMessage = 'Contato atualizado com sucesso.';
    toast.success(successMessage);
    setNotification({ success: successMessage, error: '' });
    setTimeout(() => setNotification(prev => ({ ...prev, success: '' })), NOTIFICATION_TIMEOUT);
  };

  // Handler para excluir um contato
  const deleteContact = async (contactId) => {
    const confirmDelete = window.confirm('Tem certeza de que deseja excluir este contato?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${CONTACTS_API_ENDPOINT}/${contactId}`);
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
      const successMessage = 'Contato excluído com sucesso.';
      toast.success(successMessage);
      setNotification({ success: successMessage, error: '' });
      setTimeout(() => setNotification(prev => ({ ...prev, success: '' })), NOTIFICATION_TIMEOUT);
    } catch (err) {
      const errorMessage = 'Erro ao excluir o contato.';
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

          <AddContactButton onClick={openAddModal} />

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
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{contact.nome}</p>
                      <p className="text-sm text-gray-600">CPF: {contact.cpf}</p>
                      <p className="text-sm text-gray-600">Telefone: {contact.telefone}</p>
                      <p className="text-sm text-gray-600">Endereço: {contact.endereco}</p>
                      <p className="text-sm text-gray-600">
                        Complemento: {contact.complemento || 'Nenhum complemento'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {/* Botão de Editar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita a seleção do contato ao clicar no botão
                          openEditModal(contact);
                        }}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      {/* Botão de Excluir */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita a seleção do contato ao clicar no botão
                          deleteContact(contact.id);
                        }}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Nenhum contato encontrado.</li>
            )}
          </ul>

          {/* Paginação */}
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

      {/* Modal de Adição de Contato */}
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddContact={addContact}
      />

      {/* Modal de Edição de Contato */}
      <EditContactModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        contact={selectedContact}
        onUpdateContact={updateContact}
      />
    </AuthenticatedLayout>
  );
};
