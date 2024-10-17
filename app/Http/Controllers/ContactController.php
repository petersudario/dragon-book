<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    /**
     * Lista os contatos do usuário, com opção de filtro por nome ou CPF.
     */
    public function index(Request $request)
    {
        $query = Auth::user()->contacts();
    
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('cpf', 'like', "%{$search}%");
            });
        }
    
        $contacts = $query->get();
    
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
