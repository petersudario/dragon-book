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
     * Lista os contatos do usuário.
     */
    public function index()
    {
        $contacts = Auth::user()->contacts()->get();

        return Inertia::render('Dashboard', [
            'contacts' => $contacts,
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
