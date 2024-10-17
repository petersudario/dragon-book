<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $contacts = $user->contacts()->get();

        return Inertia::render('Dashboard', [
            'user' => $user,
            'contacts' => $contacts,
        ]);
    }
}
