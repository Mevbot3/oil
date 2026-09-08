export function BarrelMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="24" cy="10" rx="14" ry="5" fill="#E8B84A" />
      <path
        d="M10 10v26c0 3 6.3 6 14 6s14-3 14-6V10"
        fill="#C4922A"
      />
      <path
        d="M10 18c0 3 6.3 5 14 5s14-2 14-5"
        stroke="#8A6414"
        strokeWidth="1.4"
      />
      <path
        d="M10 26c0 3 6.3 5 14 5s14-2 14-5"
        stroke="#8A6414"
        strokeWidth="1.4"
      />
      <ellipse cx="24" cy="10" rx="14" ry="5" fill="#F3D27A" />
      <path
        d="M22 8c1-6 7-8 11-4 2 2-1 5-5 4"
        stroke="#F5C451"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="31" cy="5" r="1.6" fill="#F8E19A" />
    </svg>
  );
}
