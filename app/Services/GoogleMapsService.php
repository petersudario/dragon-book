<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GoogleMapsService
{
    protected string $baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.google_maps.api_key');
    }

    /**
     * Obtém as coordenadas geográficas a partir do endereço.
     *
     * @param string $address
     * @return array|null
     */
    public function getCoordinates(string $address): ?array
    {
        $response = Http::get($this->baseUrl, [
            'address' => $address,
            'key' => $this->apiKey,
        ]);

        if ($response->failed() || $response->json('status') !== 'OK') {
            return null;
        }

        $location = $response->json('results.0.geometry.location');

        return [
            'lat' => $location['lat'],
            'lng' => $location['lng'],
        ];
    }
}
