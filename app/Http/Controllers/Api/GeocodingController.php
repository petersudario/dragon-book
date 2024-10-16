<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleMapsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GeocodingController extends Controller
{
    protected GoogleMapsService $googleMapsService;

    public function __construct(GoogleMapsService $googleMapsService)
    {
        $this->googleMapsService = $googleMapsService;
    }

    /**
     * Obtém as coordenadas geográficas a partir do endereço.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function geocode(Request $request): JsonResponse
    {
        $request->validate([
            'address' => 'required|string',
        ]);

        $address = $request->address;
        $coordinates = $this->googleMapsService->getCoordinates($address);

        if (!$coordinates) {
            return response()->json(['message' => 'Não foi possível obter as coordenadas.'], 404);
        }

        return response()->json($coordinates, 200);
    }
}
