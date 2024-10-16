import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-4 px-1 pt-1 text-sm text-white font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-red text-white focus:border-red'
                    : 'border-transparent text-white hover:border-gray-300 hover:text-gray-700 focus:border-white focus:text-gray-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
