<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ViaCepService;
use App\Services\GoogleMapsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AddressController extends Controller
{
    protected ViaCepService $viaCepService;
    protected GoogleMapsService $googleMapsService;

    public function __construct(ViaCepService $viaCepService, GoogleMapsService $googleMapsService)
    {
        $this->viaCepService = $viaCepService;
        $this->googleMapsService = $googleMapsService;
    }

    /**
     * Retorna o endereço baseado no CEP, incluindo coordenadas geográficas.
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

        $fullAddress = "{$address['logradouro']}, {$address['bairro']}, {$address['localidade']}, {$address['uf']}";
        $coordinates = $this->googleMapsService->getCoordinates($fullAddress);

        if ($coordinates) {
            $address['lat'] = $coordinates['lat'];
            $address['lng'] = $coordinates['lng'];
        } else {
            $address['lat'] = null;
            $address['lng'] = null;
        }

        return response()->json($address, 200);
    }
}
