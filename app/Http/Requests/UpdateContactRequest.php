<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\ValidCpf;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class UpdateContactRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição.
     */
    public function authorize()
    {
        // Você pode ajustar a lógica de autorização conforme necessário
        return true;
    }

    /**
     * Define as regras de validação para a atualização do contato.
     */
    public function rules()
    {
        // Obtém o ID do contato a partir dos parâmetros da rota
        $contactId = $this->route('id');

        return [
            'nome' => 'required|string|max:255',
            'cpf' => [
                'required',
                'string',
                new ValidCpf(),
                // Regra para garantir que o CPF seja único por usuário, exceto para o contato atual
                Rule::unique('contacts', 'cpf')
                    ->where(function ($query) {
                        return $query->where('user_id', Auth::id());
                    })
                    ->ignore($contactId),
            ],            
            'telefone' => 'required|string|max:20',
            'cep' => 'required|string|size:9',
            'endereco' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'complemento' => 'nullable|string|max:255',
        ];
    }

    /**
     * Personaliza as mensagens de erro para validação.
     */
    public function messages()
    {
        return [
            'cpf.unique' => 'O CPF já está em uso em outro contato.',
        ];
    }
}
