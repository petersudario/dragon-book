import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });


    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <form onSubmit={submit} className="bg-white p-8 shadow-md rounded-lg">

                <div className="mt-4">
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-orange-600"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2 text-orange-600" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-orange-600"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-orange-600" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('register')}
                        className="rounded-md text-sm text-orange-600 underline hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        Not registered?
                    </Link>
                    <PrimaryButton
                        className="ms-4 bg-orange-600 text-white hover:bg-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        disabled={processing}
                    >
                        Login
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
