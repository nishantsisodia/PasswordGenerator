export default function IconSpark({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="var(--brand-1, #7c3aed)" />
          <stop offset="1" stopColor="var(--brand-2, #06b6d4)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l1.8 4.6L18.8 8l-4.8 2.4L12 16l-1.9-5.6L5.2 8l4.9-1.4L12 2z"
        fill="url(#g)"
      />
    </svg>
  );
}
