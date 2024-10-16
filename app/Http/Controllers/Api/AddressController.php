<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ViaCepService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AddressController extends Controller
{
    protected ViaCepService $viaCepService;

    public function __construct(ViaCepService $viaCepService)
    {
        $this->viaCepService = $viaCepService;
    }

    /**
     * Armazena ou retorna o endereço baseado no CEP.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'cep' => 'required|string|size:8',
        ]);

        $cep = preg_replace('/\D/', '', $request->cep);

        $address = $this->viaCepService->getAddressByCep($cep);

        if (!$address) {
            return response()->json(['message' => 'CEP não encontrado.'], 404);
        }

        return response()->json($address, 200);
    }
}
