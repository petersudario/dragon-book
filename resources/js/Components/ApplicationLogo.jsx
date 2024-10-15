export default function ApplicationLogo(props) {
    return (
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
    );
}
