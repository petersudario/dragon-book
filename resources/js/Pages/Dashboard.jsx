import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Map from '@/Components/Map';
import { Head } from '@inertiajs/react';
import useGeolocation from '@/hook/UseGeolocation';

export default function Dashboard() {
    const { location, error } = useGeolocation();
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            {error && <p className="error">Erro de geolocalização: {error}</p>}
            <div className='h-screen'>
                {location ? (
                    <div className="map-container">
                        <Map center={location} />
                    </div>
                ) : (
                    <div className="map-container">
                        <Map />
                    </div>
                )}
            </div>

        </AuthenticatedLayout>
    );
}
