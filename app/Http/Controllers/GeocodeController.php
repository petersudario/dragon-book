<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeocodeController extends Controller
{
    public function getCoordinates(Request $request)
    {
        $googleApiKey = env('GOOGLE_MAPS_API_KEY');
        $address = $request->input('address');

        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'address' => $address,
            'key' => $googleApiKey,
        ]);

        if ($response->successful()) {
            $data = $response->json();
            if (isset($data['results'][0]['geometry']['location'])) {
                $location = $data['results'][0]['geometry']['location'];
                return response()->json([
                    'latitude' => $location['lat'],
                    'longitude' => $location['lng']
                ]);
            }
        }

        return response()->json(['error' => 'Coordinates not found'], 404);
    }
}
