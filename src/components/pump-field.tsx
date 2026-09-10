const STARS = seedStars(120);

const SKYLINE = [
  { kind: "derrick" as const, x: 70, y: 618, s: 0.72 },
  { kind: "jack" as const, x: 168, y: 622, s: 0.9, dur: 4.8, delay: -0.8, variant: 0 },
  { kind: "tank" as const, x: 250, y: 622, s: 0.7 },
  { kind: "derrick" as const, x: 318, y: 618, s: 0.48 },
  { kind: "jack" as const, x: 410, y: 623, s: 0.58, dur: 6.1, delay: -2.4, variant: 1 },
  { kind: "derrick" as const, x: 520, y: 617, s: 0.82 },
  { kind: "jack" as const, x: 618, y: 622, s: 0.7, dur: 5.2, delay: -1.1, variant: 0 },
  { kind: "lamp" as const, x: 704, y: 620 },
  { kind: "derrick" as const, x: 790, y: 618, s: 0.4 },
  { kind: "jack" as const, x: 880, y: 623, s: 0.64, dur: 4.4, delay: -3.2, variant: 1 },
  { kind: "tank" as const, x: 980, y: 622, s: 0.85 },
  { kind: "derrick" as const, x: 1088, y: 618, s: 0.6 },
  { kind: "jack" as const, x: 1190, y: 622, s: 0.78, dur: 5.7, delay: -0.4, variant: 0 },
  { kind: "derrick" as const, x: 1320, y: 617, s: 0.5 },
  { kind: "jack" as const, x: 1436, y: 623, s: 0.66, dur: 4.9, delay: -2.8, variant: 1 },
  { kind: "derrick" as const, x: 1548, y: 618, s: 0.68 },
];

const NEAR = [
  { x: 120, y: 792, s: 1.35, dur: 3.6, delay: -1.6, variant: 0 },
  { x: 1480, y: 776, s: 1.55, dur: 3.2, delay: -0.5, variant: 1 },
];

function seedStars(count: number) {
  const stars: { x: number; y: number; r: number; delay: number }[] = [];
  let seed = 69420;
  for (let i = 0; i < count; i += 1) {
    seed = (seed * 16807) % 2147483647;
    const x = seed % 1600;
    seed = (seed * 16807) % 2147483647;
    const y = ((seed % 1000) / 1000) ** 1.65 * 500;
    seed = (seed * 16807) % 2147483647;
    const r = 0.35 + (seed % 16) / 12;
    stars.push({ x, y, r, delay: (i % 9) * -0.7 });
  }
  return stars;
}

function Derrick() {
  return (
    <g className="rig-ink">
      <path d="M-30 0 L-9 -132 M30 0 L9 -132" />
      <path d="M-26 -28 H26 M-22 -56 H22 M-17 -84 H17 M-12 -110 H12" />
      <path d="M-30 0 L26 -28 M30 0 L-26 -28 M-26 -28 L22 -56 M26 -28 L-22 -56 M-22 -56 L17 -84 M22 -56 L-17 -84 M-17 -84 L12 -110 M17 -84 L-12 -110" />
      <rect x="-8" y="-144" width="16" height="12" />
      <path d="M-36 0 H36" />
    </g>
  );
}

function Jack({
  dur,
  delay,
  variant,
}: {
  dur: number;
  delay: number;
  variant: number;
}) {
  return (
    <g className="rig-fill">
      <path d="M-48 0 H58" strokeWidth="7" stroke="currentColor" />
      <path d="M-18 0 L-4 -58 L4 -58 L18 0 L8 0 L0 -48 L-8 0 Z" />
      <path d="M32 -32 H58 V-6 H32 Z" />
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 -18"
          to="360 50 -18"
          dur={`${dur}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
        <path d="M47 -36 V2" stroke="currentColor" strokeWidth="5" />
        <circle cx="50" cy="-18" r="11" />
        <circle cx="50" cy="-36" r="5" />
      </g>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={variant === 0 ? "-16 0 -56;14 0 -56;-16 0 -56" : "-12 0 -56;16 0 -56;-12 0 -56"}
          keyTimes="0;0.5;1"
          dur={`${dur}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
        />
        <path d="M-62 -62 H64" stroke="currentColor" strokeWidth="9" strokeLinecap="square" />
        {variant === 0 ? (
          <path d="M-62 -66 C-96 -74 -118 -36 -108 8 C-92 -18 -74 -30 -58 -34 Z" />
        ) : (
          <path d="M-64 -70 L-92 -58 L-98 -20 L-78 -8 L-60 -28 Z" />
        )}
        <path d="M-58 -28 V8" stroke="currentColor" strokeWidth="4" />
        <circle cx="58" cy="-56" r="7" />
      </g>
    </g>
  );
}

function Tanks() {
  return (
    <g className="rig-fill">
      <ellipse cx="-18" cy="-10" rx="22" ry="10" />
      <rect x="-40" y="-10" width="44" height="18" />
      <ellipse cx="-18" cy="8" rx="22" ry="10" />
      <ellipse cx="28" cy="-8" rx="18" ry="8" />
      <rect x="10" y="-8" width="36" height="16" />
      <ellipse cx="28" cy="8" rx="18" ry="8" />
    </g>
  );
}

function Lamp({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse className="well-glow" cx="0" cy="4" rx="46" ry="14" />
      <path d="M0 -52 V8" stroke="#1a140c" strokeWidth="4" />
      <rect x="-10" y="-60" width="20" height="10" fill="#f0b429" opacity="0.75" />
    </g>
  );
}

export function PumpField() {
  return (
    <div className="pump-field pointer-events-none" aria-hidden>
      <div className="night-sky" />
      <svg
        className="star-sheet"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMin slice"
      >
        {STARS.map((star, index) => (
          <circle
            key={`${star.x}-${index}`}
            className="star"
            cx={star.x}
            cy={star.y}
            r={star.r}
            style={{ animationDelay: `${star.delay}s` }}
          />
        ))}
      </svg>
      <svg
        className="lease-land"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <radialGradient id="dawnBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0b429" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f0b429" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="800" cy="610" rx="640" ry="36" fill="url(#dawnBloom)" />

        <path
          d="M0 620 L90 548 210 532 310 568 420 550 540 620 Z"
          fill="#161b24"
        />
        <path
          d="M1040 620 L1140 536 1288 522 1390 558 1600 620 Z"
          fill="#161b24"
        />
        <path
          d="M560 620 L650 574 760 566 840 596 900 620 Z"
          fill="#1b212c"
        />

        <rect x="0" y="616" width="1600" height="284" fill="#0c0e12" />

        {SKYLINE.map((piece, index) => {
          if (piece.kind === "lamp") {
            return <Lamp key={`lamp-${index}`} x={piece.x} y={piece.y} />;
          }
          const s = "s" in piece ? piece.s : 1;
          return (
            <g
              key={`${piece.kind}-${index}`}
              transform={`translate(${piece.x} ${piece.y}) scale(${s})`}
            >
              {piece.kind === "derrick" && <Derrick />}
              {piece.kind === "jack" && (
                <Jack
                  dur={piece.dur}
                  delay={piece.delay}
                  variant={piece.variant}
                />
              )}
              {piece.kind === "tank" && <Tanks />}
            </g>
          );
        })}

        <path
          d="M0 760 C280 728 620 804 980 748 C1280 704 1460 790 1600 752 V900 H0 Z"
          fill="#08090c"
        />

        {NEAR.map((jack) => (
          <g
            key={`near-${jack.x}`}
            transform={`translate(${jack.x} ${jack.y}) scale(${jack.s})`}
          >
            <Jack dur={jack.dur} delay={jack.delay} variant={jack.variant} />
          </g>
        ))}
      </svg>
    </div>
  );
}
