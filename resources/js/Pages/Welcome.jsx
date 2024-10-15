import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, agendaVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Dragon Book" />
            <div className="relative bg-gradient-to-b from-orange-500 to-orange-700 text-white">
                <div className="absolute inset-0 bg-[url('/images/contacts-pattern.svg')] bg-cover opacity-10"></div>

                <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
                    <div className="max-w-7xl px-6 py-12">
                        <header className="flex flex-col items-center gap-4">
                            <svg
                                className="w-32 h-32 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 64 64"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    d="M32 2C17 2 2 17 2 32s15 30 30 30 30-15 30-30S47 2 32 2z"
                                    fill="none"
                                    stroke="currentColor"
                                />
                                <path
                                    d="M22 32c0 5.52 4.48 10 10 10s10-4.48 10-10H22z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M24 16L32 22L40 16M40 48L32 42L24 48"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <h1 className="text-4xl font-bold text-white">
                                Welcome to Dragon Book. Your personal contact list.
                            </h1>
                            <p className="text-lg text-white/70">
                                Keep your contacts close, organized, and always accessible.
                            </p>
                        </header>

                        {/* Navigation Section */}
                        <nav className="flex justify-center gap-8 mt-8">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full px-6 py-3 bg-white text-orange-600 font-semibold shadow-lg hover:bg-orange-50 transition"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-full px-6 py-3 bg-white text-orange-600 font-semibold shadow-lg hover:bg-orange-50 transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full px-6 py-3 bg-orange-600 text-white font-semibold shadow-lg hover:bg-orange-500 transition"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>

                        <main className="mt-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="flex flex-col items-start p-6 bg-white/10 rounded-lg shadow-lg">
                                    <div className="mb-4">
                                        <svg
                                            className="w-12 h-12 text-orange-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7v1a3 3 0 01-6 0V7a3 3 0 00-6 0v4a8 8 0 0016 0V7a3 3 0 00-6 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">
                                        Organize Your Contacts
                                    </h3>
                                    <p className="mt-2 text-white/70">
                                        Keep all your important contacts in one place, neatly organized and easy to access.
                                    </p>
                                </div>

                                <div className="flex flex-col items-start p-6 bg-white/10 rounded-lg shadow-lg">
                                    <div className="mb-4">
                                        <svg
                                            className="w-12 h-12 text-orange-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">
                                        Always Stay Connected
                                    </h3>
                                    <p className="mt-2 text-white/70">
                                        Quick access to call, message, or email your contacts right from the app.
                                    </p>
                                </div>

                                <div className="flex flex-col items-start p-6 bg-white/10 rounded-lg shadow-lg">
                                    <div className="mb-4">
                                        <svg
                                            className="w-12 h-12 text-orange-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4l3 3m9 5H3m3-7V7a2 2 0 012-2h10a2 2 0 012 2v5"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">
                                        Backup and Sync
                                    </h3>
                                    <p className="mt-2 text-white/70">
                                        Safeguard your contacts with automatic backups and seamless syncing across all devices.
                                    </p>
                                </div>
                            </div>
                        </main>

                    </div>
                </div>
            </div>
        </>
    );
}
