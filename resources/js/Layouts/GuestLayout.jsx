import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-orange-500 to-orange-700 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link className="flex gap-2 items-center justify-center" href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
                <h1 className="text-4xl font-bold text-white">
                    Dragon Book
                </h1>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
