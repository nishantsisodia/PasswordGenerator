export default function Logo({ size = 32 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="6" fill="var(--brand-1)" />
        <path
          d="M7 12c1.5-2 4.5-2 6 0"
          stroke="var(--text)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9" r="1.2" fill="var(--text)" />
      </svg>
      <span style={{ fontWeight: 800, fontSize: 18, color: "var(--text)" }}>
        PassVault
      </span>
    </div>
  );
}
