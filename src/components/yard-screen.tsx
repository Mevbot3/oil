type YardScreenProps = {
  plate: string;
  readout: string;
  sub: string;
  live?: boolean;
  className?: string;
};

export function YardScreen({
  plate,
  readout,
  sub,
  live = true,
  className,
}: YardScreenProps) {
  return (
    <svg
      viewBox="0 0 280 200"
      className={className}
      role="img"
      aria-label={`${plate} ${readout}`}
    >
      <rect width="280" height="200" rx="10" fill="#1a1814" />
      <rect x="8" y="8" width="264" height="184" rx="6" fill="#0d0c0a" />
      <rect x="22" y="20" width="236" height="138" rx="3" fill="#061108" />
      <rect
        x="26"
        y="24"
        width="228"
        height="130"
        rx="2"
        fill={live ? "#0a1a0c" : "#0a0a0a"}
      />
      <text
        x="38"
        y="52"
        fill={live ? "#6f9a4a" : "#4a4a40"}
        fontFamily="ui-monospace, monospace"
        fontSize="13"
        letterSpacing="3"
      >
        {plate}
      </text>
      <text
        x="38"
        y="98"
        fill={live ? "#b6e07a" : "#6a6a58"}
        fontFamily="ui-monospace, monospace"
        fontSize="28"
      >
        {readout}
      </text>
      <text
        x="38"
        y="128"
        fill={live ? "#7aa85a" : "#4a4a40"}
        fontFamily="ui-monospace, monospace"
        fontSize="12"
      >
        {sub}
      </text>
      <circle cx="42" cy="176" r="5" fill={live ? "#8fbe6a" : "#3a3a32"} />
      <rect x="56" y="172" width="28" height="7" rx="1" fill="#2a2720" />
      <rect x="90" y="172" width="28" height="7" rx="1" fill="#2a2720" />
      <rect x="196" y="170" width="52" height="12" rx="2" fill="#2c2618" />
    </svg>
  );
}
