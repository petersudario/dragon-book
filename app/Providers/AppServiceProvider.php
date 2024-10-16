<?php

namespace App\Providers;

use App\Services\GoogleMapsService;
use App\Services\ViaCepService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ViaCepService::class, function ($app) {
            return new ViaCepService();
        });

        $this->app->singleton(GoogleMapsService::class, function ($app) {
            return new GoogleMapsService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }

}
