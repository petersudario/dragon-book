import React from 'react';

export default function AddContactButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
            Adicionar Contato
        </button>
    );
}

