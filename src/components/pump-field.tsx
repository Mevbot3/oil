const JACKS = [
  { x: 210, y: 312, s: 0.16, dur: 4.2, delay: -0.4, tone: "#1a120c" },
  { x: 430, y: 298, s: 0.13, dur: 4.8, delay: -2.1, tone: "#1a120c" },
  { x: 690, y: 288, s: 0.11, dur: 5.1, delay: -1.2, tone: "#1c140e" },
  { x: 980, y: 304, s: 0.15, dur: 4.4, delay: -3.3, tone: "#1a120c" },
  { x: 1210, y: 292, s: 0.12, dur: 5.4, delay: -0.8, tone: "#1c140e" },
  { x: 1480, y: 318, s: 0.17, dur: 4.6, delay: -2.6, tone: "#1a120c" },
  { x: 160, y: 478, s: 0.38, dur: 3.4, delay: -1.5, tone: "#100c08" },
  { x: 520, y: 502, s: 0.34, dur: 3.8, delay: -0.2, tone: "#120e0a" },
  { x: 880, y: 458, s: 0.41, dur: 3.2, delay: -2.8, tone: "#100c08" },
  { x: 1240, y: 490, s: 0.36, dur: 3.6, delay: -1.9, tone: "#120e0a" },
  { x: 1520, y: 470, s: 0.3, dur: 4.0, delay: -3.6, tone: "#140f0b" },
  { x: 90, y: 742, s: 0.92, dur: 2.7, delay: -0.6, tone: "#070604" },
  { x: 620, y: 778, s: 0.68, dur: 3.1, delay: -1.8, tone: "#080705" },
  { x: 1380, y: 728, s: 1.12, dur: 2.55, delay: -2.4, tone: "#060504" },
] as const;

function Jack({
  x,
  y,
  s,
  dur,
  delay,
  tone,
}: (typeof JACKS)[number]) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-70 148 H86" stroke={tone} strokeWidth="10" strokeLinecap="square" />
      <path d="M-18 40 L-52 150 H-28 L-8 72 L12 150 H36 Z" fill={tone} />
      <path d="M-36 104 H24" stroke={tone} strokeWidth="7" />
      <path d="M18 108 H92 V156 H18 Z" fill={tone} />
      <circle cx="78" cy="138" r="26" fill={tone} />
      <path d="M-128 128 H-98 V156 H-128 Z" fill={tone} />
      <circle cx="-113" cy="128" r="8" fill={tone} />
      <g className="jack-beam">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-15 0 0;13 0 0;-15 0 0"
          keyTimes="0;0.5;1"
          dur={`${dur}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
        />
        <path d="M-118 -10 H108" stroke={tone} strokeWidth="16" strokeLinecap="square" />
        <path
          d="M-118 -18 C-168 -28 -196 8 -188 58 C-158 28 -132 14 -108 8 Z"
          fill={tone}
        />
        <path d="M-116 8 V132" stroke={tone} strokeWidth="5" />
        <circle cx="100" cy="-2" r="11" fill={tone} />
      </g>
    </g>
  );
}

function Derrick({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#0d0a07">
      <path d="M0 -210 L-58 140 H58 Z" />
      <path
        d="M-18 -150 H18 M-28 -80 H28 M-38 -10 H38 M-48 60 H48"
        stroke="#0d0a07"
        strokeWidth="5"
        fill="none"
      />
      <rect x="-8" y="-228" width="16" height="20" />
      <rect x="-22" y="128" width="44" height="16" />
    </g>
  );
}

export function PumpField() {
  return (
    <div className="pump-field pointer-events-none" aria-hidden>
      <div className="sunset-wash" />
      <svg
        className="field-scene"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8d2" />
            <stop offset="42%" stopColor="#ffe27a" />
            <stop offset="100%" stopColor="#ffb03a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#ffc14d" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e07a18" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1810" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#1a0e08" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="ridgeMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#160e09" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#0c0806" stopOpacity="0.88" />
          </linearGradient>
        </defs>

        <circle className="sun-bloom" cx="780" cy="168" r="240" fill="url(#sunBloom)" />
        <circle className="sun-core" cx="780" cy="168" r="58" fill="url(#sunCore)" />

        <g className="cloud-drift cloud-drift-a" fill="#fff4c8" fillOpacity="0.18">
          <ellipse cx="240" cy="110" rx="90" ry="18" />
          <ellipse cx="300" cy="102" rx="54" ry="14" />
          <ellipse cx="190" cy="118" rx="40" ry="10" />
        </g>
        <g className="cloud-drift cloud-drift-b" fill="#ffe7a0" fillOpacity="0.14">
          <ellipse cx="1180" cy="86" rx="120" ry="20" />
          <ellipse cx="1260" cy="78" rx="70" ry="16" />
          <ellipse cx="1100" cy="92" rx="48" ry="12" />
        </g>
        <g className="cloud-drift cloud-drift-c" fill="#fff1bc" fillOpacity="0.12">
          <ellipse cx="560" cy="200" rx="70" ry="12" />
          <ellipse cx="610" cy="194" rx="36" ry="9" />
        </g>

        <path
          d="M0 360 C180 330 340 378 520 348 C760 308 980 372 1200 338 C1380 314 1500 350 1600 336 V900 H0 Z"
          fill="url(#ridgeFar)"
        />

        {JACKS.slice(0, 6).map((jack) => (
          <Jack key={`${jack.x}-${jack.y}`} {...jack} />
        ))}

        <Derrick x={340} y={430} s={0.42} />

        <path
          d="M0 520 C220 488 420 556 700 512 C980 468 1180 548 1600 508 V900 H0 Z"
          fill="url(#ridgeMid)"
        />

        {JACKS.slice(6, 11).map((jack) => (
          <Jack key={`${jack.x}-${jack.y}`} {...jack} />
        ))}

        <path
          d="M0 760 C260 720 520 800 860 748 C1180 700 1400 790 1600 742 V900 H0 Z"
          fill="#070604"
        />

        {JACKS.slice(11).map((jack) => (
          <Jack key={`${jack.x}-${jack.y}`} {...jack} />
        ))}
      </svg>
    </div>
  );
}
