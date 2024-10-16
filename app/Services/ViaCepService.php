<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ViaCepService
{
    protected string $baseUrl = 'https://viacep.com.br/ws';

    /**
     * Obtém o endereço a partir do CEP.
     *
     * @param string $cep
     * @return array|null
     */
    public function getAddressByCep(string $cep): ?array
    {
        $response = Http::get("{$this->baseUrl}/{$cep}/json/");

        if ($response->failed() || $response->json('erro')) {
            return null;
        }

        return $response->json();
    }
}
