import React from 'react';
import EditContactForm from './EditContactForm';

export default function EditContactModal({ isOpen, onClose, contact, onUpdateContact }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Editar Contato</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
                        aria-label="Fechar Modal"
                    >
                        &times;
                    </button>
                </div>
                
                <div className="p-4">
                    <EditContactForm 
                        contact={contact} 
                        onCancel={onClose} 
                        onUpdateContact={onUpdateContact} 
                    />
                </div>
            </div>
        </div>
    );
};
