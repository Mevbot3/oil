export function BarrelMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="36" cy="20" rx="20" ry="8" fill="#F3D27A" />
      <path
        d="M16 20v34c0 5 9 9 20 9s20-4 20-9V20"
        fill="#C4922A"
      />
      <path
        d="M16 32c0 4 9 7 20 7s20-3 20-7"
        stroke="#8A6414"
        strokeWidth="2"
      />
      <path
        d="M16 44c0 4 9 7 20 7s20-3 20-7"
        stroke="#8A6414"
        strokeWidth="2"
      />
      <ellipse cx="36" cy="20" rx="20" ry="8" fill="#F6D56A" />
      <rect
        x="18"
        y="22"
        width="36"
        height="10"
        rx="5"
        fill="#111"
      />
      <circle cx="29" cy="27" r="3.4" fill="#F3D27A" />
      <circle cx="43" cy="27" r="3.4" fill="#F3D27A" />
      <path
        d="M28 48c3 3 13 3 16 0"
        stroke="#3a2a10"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M34 10c1-8 10-10 14-5 2 3-2 6-6 5"
        stroke="#F5C451"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="47" cy="6" r="2.2" fill="#F8E19A" />
    </svg>
  );
}
