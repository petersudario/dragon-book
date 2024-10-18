<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{

    /**
     * Lista os contatos do usuário, com opção de filtro por nome ou CPF,
     * e ordena os resultados em ordem alfabética pelo nome.
     */
    public function index(Request $request)
    {
        // Inicia a consulta dos contatos do usuário autenticado
        $query = Auth::user()->contacts();

        // Aplica o filtro de busca se o parâmetro 'search' estiver presente
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('cpf', 'like', "%{$search}%");
            });
        }

        // Adiciona a ordenação alfabética pelo nome
        $query->orderBy('nome', 'asc');

        // Executa a consulta para obter os contatos
        $contacts = $query->get();

        // Retorna a resposta em formato JSON com os contatos ordenados
        return response()->json([
            'contacts' => $contacts,
            'search' => $search ?? '',
        ]);
    }
    

    /**
     * Armazena um novo contato.
     */
    public function store(StoreContactRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();
    
        $contact = Contact::create($data);
    
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Contato criado com sucesso!',
                'contact' => $contact,
            ], 201);
        }
    
        return redirect()->back()->with('success', 'Contato criado com sucesso!');
    }
}
