const STARS = seedStars(160);

const FAR = [
  { kind: "derrick" as const, x: 96, y: 548, s: 0.34 },
  { kind: "jack" as const, x: 168, y: 552, s: 0.32, dur: 7.2, delay: -1.4, variant: 0 },
  { kind: "derrick" as const, x: 248, y: 547, s: 0.28 },
  { kind: "jack" as const, x: 390, y: 553, s: 0.26, dur: 8.1, delay: -3.8, variant: 1 },
  { kind: "derrick" as const, x: 720, y: 548, s: 0.3 },
  { kind: "jack" as const, x: 980, y: 552, s: 0.28, dur: 7.6, delay: -2.2, variant: 0 },
  { kind: "derrick" as const, x: 1180, y: 547, s: 0.26 },
  { kind: "jack" as const, x: 1410, y: 553, s: 0.3, dur: 8.4, delay: -0.7, variant: 1 },
];

const MID = [
  { kind: "derrick" as const, x: 70, y: 618, s: 0.72 },
  { kind: "jack" as const, x: 168, y: 622, s: 0.9, dur: 4.8, delay: -0.8, variant: 0 },
  { kind: "tank" as const, x: 250, y: 622, s: 0.7 },
  { kind: "derrick" as const, x: 318, y: 618, s: 0.48 },
  { kind: "jack" as const, x: 410, y: 623, s: 0.58, dur: 6.1, delay: -2.4, variant: 1 },
  { kind: "flare" as const, x: 478, y: 622, s: 0.9 },
  { kind: "derrick" as const, x: 548, y: 617, s: 0.82 },
  { kind: "jack" as const, x: 640, y: 622, s: 0.7, dur: 5.2, delay: -1.1, variant: 0 },
  { kind: "lamp" as const, x: 724, y: 620 },
  { kind: "derrick" as const, x: 810, y: 618, s: 0.4 },
  { kind: "jack" as const, x: 900, y: 623, s: 0.64, dur: 4.4, delay: -3.2, variant: 1 },
  { kind: "tank" as const, x: 1000, y: 622, s: 0.85 },
  { kind: "derrick" as const, x: 1108, y: 618, s: 0.6 },
  { kind: "jack" as const, x: 1210, y: 622, s: 0.78, dur: 5.7, delay: -0.4, variant: 0 },
  { kind: "lamp" as const, x: 1290, y: 620 },
  { kind: "derrick" as const, x: 1360, y: 617, s: 0.5 },
  { kind: "jack" as const, x: 1460, y: 623, s: 0.66, dur: 4.9, delay: -2.8, variant: 1 },
  { kind: "derrick" as const, x: 1560, y: 618, s: 0.68 },
];

const NEAR = [
  { x: 110, y: 798, s: 1.42, dur: 3.6, delay: -1.6, variant: 0 },
  { x: 560, y: 820, s: 0.82, dur: 4.1, delay: -2.9, variant: 1 },
  { x: 1500, y: 780, s: 1.62, dur: 3.2, delay: -0.5, variant: 1 },
];

function seedStars(count: number) {
  const stars: { x: number; y: number; r: number; delay: number; bright: boolean }[] =
    [];
  let seed = 69420;
  for (let i = 0; i < count; i += 1) {
    seed = (seed * 16807) % 2147483647;
    const x = seed % 1600;
    seed = (seed * 16807) % 2147483647;
    const y = ((seed % 1000) / 1000) ** 1.7 * 490;
    seed = (seed * 16807) % 2147483647;
    const r = 0.3 + (seed % 18) / 11;
    stars.push({
      x,
      y,
      r,
      delay: (i % 11) * -0.55,
      bright: i % 17 === 0,
    });
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
      <path d="M-54 2 H64" strokeWidth="8" stroke="currentColor" />
      <path d="M-22 2 H-8 V16 H-22 Z" />
      <path d="M-18 0 L-4 -58 L4 -58 L18 0 L8 0 L0 -48 L-8 0 Z" />
      <path d="M-10 0 H10" strokeWidth="4" stroke="currentColor" />
      <path d="M32 -32 H60 V-4 H32 Z" />
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
        <path d="M47 -38 V4" stroke="currentColor" strokeWidth="5" />
        <circle cx="50" cy="-18" r="12" />
        <circle cx="50" cy="-38" r="5" />
      </g>
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={
            variant === 0
              ? "-16 0 -56;14 0 -56;-16 0 -56"
              : "-12 0 -56;16 0 -56;-12 0 -56"
          }
          keyTimes="0;0.5;1"
          dur={`${dur}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
        />
        <path
          d="M-64 -62 H66"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="square"
        />
        {variant === 0 ? (
          <path d="M-64 -66 C-98 -76 -122 -34 -110 10 C-94 -16 -76 -28 -58 -34 Z" />
        ) : (
          <path d="M-66 -72 L-96 -56 L-102 -16 L-80 -6 L-60 -30 Z" />
        )}
        <path d="M-58 -28 V12" stroke="currentColor" strokeWidth="4" />
        <circle cx="60" cy="-56" r="7" />
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

function Flare() {
  return (
    <g>
      <path d="M-6 0 H6 V-78 H-6 Z" className="rig-fill" />
      <path d="M-16 0 H16" stroke="#0a0c10" strokeWidth="6" />
      <g className="flare-fire" transform="translate(0 -78)">
        <path d="M-7 0 C-10 -18 -4 -28 0 -40 C4 -28 10 -18 7 0 Z" />
        <path
          className="flare-core"
          d="M-3 0 C-4 -10 -1 -18 0 -26 C1 -18 4 -10 3 0 Z"
        />
      </g>
    </g>
  );
}

function Lamp({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse className="well-glow" cx="0" cy="6" rx="54" ry="16" />
      <path d="M0 -56 V10" stroke="#1a140c" strokeWidth="4" />
      <rect x="-11" y="-64" width="22" height="11" fill="#f0b429" opacity="0.8" />
    </g>
  );
}

function Place({
  piece,
  ink,
}: {
  piece: (typeof FAR)[number] | (typeof MID)[number];
  ink: string;
}) {
  if (piece.kind === "lamp") {
    return <Lamp x={piece.x} y={piece.y} />;
  }
  return (
    <g
      className={ink}
      transform={`translate(${piece.x} ${piece.y}) scale(${piece.s})`}
    >
      {piece.kind === "derrick" && <Derrick />}
      {piece.kind === "jack" && (
        <Jack dur={piece.dur} delay={piece.delay} variant={piece.variant} />
      )}
      {piece.kind === "tank" && <Tanks />}
      {piece.kind === "flare" && <Flare />}
    </g>
  );
}

export function PumpField() {
  return (
    <div className="pump-field pointer-events-none" aria-hidden>
      <div className="night-sky" />
      <div className="haze-band" />
      <svg
        className="star-sheet"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMin slice"
      >
        <g className="moon-pack">
          <circle className="moon-glow" cx="1240" cy="148" r="46" />
          <circle className="moon" cx="1240" cy="148" r="22" />
          <circle className="moon-shade" cx="1248" cy="142" r="18" />
        </g>
        {STARS.map((star, index) => (
          <g key={`${star.x}-${index}`}>
            <circle
              className={star.bright ? "star star-bright" : "star"}
              cx={star.x}
              cy={star.y}
              r={star.bright ? star.r + 0.8 : star.r}
              style={{ animationDelay: `${star.delay}s` }}
            />
            {star.bright && (
              <path
                className="star-spike"
                d={`M${star.x} ${star.y - 7} V${star.y + 7} M${star.x - 7} ${star.y} H${star.x + 7}`}
                style={{ animationDelay: `${star.delay}s` }}
              />
            )}
          </g>
        ))}
        <path className="shooting-star" d="M220 70 L310 118" />
      </svg>
      <div className="cloud-sheet">
        <span className="cloud cloud-a" />
        <span className="cloud cloud-b" />
        <span className="cloud cloud-c" />
      </div>
      <svg
        className="lease-land"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <radialGradient id="dawnBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f0b429" stopOpacity="0.42" />
            <stop offset="55%" stopColor="#c45c18" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#f0b429" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse className="dawn-pulse" cx="800" cy="572" rx="720" ry="52" fill="url(#dawnBloom)" />

        <path
          d="M0 558 L70 510 160 498 250 528 340 508 430 548 520 558 Z"
          fill="#1c2430"
        />
        <path
          d="M980 558 L1080 500 1200 488 1310 520 1460 506 1600 558 Z"
          fill="#1c2430"
        />

        {FAR.map((piece, index) => (
          <Place key={`far-${index}`} piece={piece} ink="rig-far" />
        ))}

        <path
          d="M0 620 L90 548 210 532 310 568 420 550 540 620 Z"
          fill="#141924"
        />
        <path
          d="M1040 620 L1140 536 1288 522 1390 558 1600 620 Z"
          fill="#141924"
        />
        <path
          d="M560 620 L650 574 760 566 840 596 900 620 Z"
          fill="#181e28"
        />

        <rect x="0" y="616" width="1600" height="284" fill="#0c0e12" />
        <path
          d="M0 636 Q200 628 420 638 T860 632 T1600 640"
          fill="none"
          stroke="#16181d"
          strokeWidth="10"
        />

        {MID.map((piece, index) => (
          <Place key={`mid-${index}`} piece={piece} ink="rig-mid" />
        ))}

        <path
          d="M0 760 C260 724 600 808 960 746 C1280 698 1460 792 1600 748 V900 H0 Z"
          fill="#07080b"
        />

        {NEAR.map((jack) => (
          <g
            key={`near-${jack.x}`}
            className="rig-near"
            transform={`translate(${jack.x} ${jack.y}) scale(${jack.s})`}
          >
            <Jack dur={jack.dur} delay={jack.delay} variant={jack.variant} />
          </g>
        ))}
      </svg>
      <div className="field-vignette" />
    </div>
  );
}
