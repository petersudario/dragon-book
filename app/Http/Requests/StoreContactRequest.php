<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\ValidCpf;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class StoreContactRequest extends FormRequest
{
    public function authorize()
    {
        return Auth::check();
    }

    public function rules()
    {
        return [
            'nome' => 'required|string|max:255',
            'cpf' => [
                'required',
                'string',
                new ValidCpf(),
                // Garante que o CPF seja único por usuário
                Rule::unique('contacts')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                }),
            ],
            'telefone' => 'required|string|max:20',
            'endereco' => 'required|string|max:255',
            'cep' => 'required|string|max:10',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'complemento' => 'nullable|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'cpf.unique' => 'Este CPF já está cadastrado para o seu usuário.',
            // Outras mensagens personalizadas podem ser adicionadas aqui
        ];
    }
}
