<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
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
        $query = Auth::user()->contacts();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('cpf', 'like', "%{$search}%");
            });
        }

        $contacts = $query->orderBy('nome', 'asc')->paginate(10);

        return response()->json([
            'contacts' => $contacts->items(),
            'current_page' => $contacts->currentPage(),
            'last_page' => $contacts->lastPage(),
            'total' => $contacts->total(),
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

     /**
     * Atualiza um contato existente.
     */
    public function update(UpdateContactRequest $request, $id)
    {
        $contact = Contact::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $data = $request->validated();

        $contact->update($data);

        return response()->json([
            'message' => 'Contato atualizado com sucesso!',
            'contact' => $contact,
        ], 200);
    }

    /**
     * Exclui um contato existente.
     */
    public function destroy($id)
    {
        $contact = Contact::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $contact->delete();

        return response()->json([
            'message' => 'Contato excluído com sucesso!',
        ], 200);
    }
}
