const GOLD = "#f0b429";
const GOLD_HOT = "#ffe08a";
const INK = "#0c0a07";

export function FundMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <circle cx="24" cy="24" r="21" fill={INK} stroke={GOLD} strokeWidth="2" />
      <circle cx="24" cy="24" r="16" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1" />
      <path
        d="M14 30l6-7 5 4 9-11"
        stroke={GOLD_HOT}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M28 16h6v6" stroke={GOLD_HOT} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Pool({ y = 34 }: { y?: number }) {
  return (
    <>
      <path
        d={`M8 ${y}c4-2.6 8-2.6 12 0s8 2.6 12 0 8-2.6 12 0`}
        stroke={GOLD}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M8 ${y + 6}c4-2.6 8-2.6 12 0s8 2.6 12 0 8-2.6 12 0`}
        stroke={GOLD}
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

export function BuyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path
        d="M24 6v16"
        stroke={GOLD_HOT}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M16 16l8 8 8-8"
        stroke={GOLD_HOT}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Pool />
    </svg>
  );
}

export function SellMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path
        d="M24 24V8"
        stroke={GOLD_HOT}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M16 16l8-8 8 8"
        stroke={GOLD_HOT}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Pool />
    </svg>
  );
}

export function CutMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <circle cx="24" cy="16" r="11" stroke={GOLD} strokeWidth="2.4" fill="none" />
      <path d="M24 5a11 11 0 0 1 9.5 5.5L24 16z" fill={GOLD_HOT} />
      <path d="M24 27v4" stroke={GOLD_HOT} strokeWidth="2.4" strokeLinecap="round" />
      <Pool y={38} />
    </svg>
  );
}

/** Two circles, one overlap. The overlap is the pool. */
export function PoolDiagram({
  className,
  left,
  right,
}: {
  className?: string;
  left: string;
  right: string;
}) {
  return (
    <svg
      viewBox="0 0 560 300"
      fill="none"
      role="img"
      aria-label={`${left} and ${right} share one pool`}
      className={className}
    >
      <defs>
        <clipPath id="pool-left">
          <circle cx="215" cy="150" r="96" />
        </clipPath>
        <marker
          id="pool-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M0 0l7 4-7 4z" fill={GOLD} />
        </marker>
      </defs>

      <circle
        cx="215"
        cy="150"
        r="96"
        fill={GOLD}
        fillOpacity="0.14"
        stroke={GOLD}
        strokeWidth="2"
      />
      <circle
        cx="345"
        cy="150"
        r="96"
        fill={GOLD}
        fillOpacity="0.06"
        stroke={GOLD}
        strokeWidth="2"
        strokeDasharray="7 6"
      />
      <g clipPath="url(#pool-left)">
        <circle cx="345" cy="150" r="96" fill={GOLD} fillOpacity="0.3" />
      </g>

      {/* Each label is centred in its own crescent, clear of the overlap. */}
      <text
        x="176"
        y="143"
        textAnchor="middle"
        className="font-heading"
        fontSize="30"
        fill={GOLD_HOT}
      >
        {left}
      </text>
      <text
        x="176"
        y="166"
        textAnchor="middle"
        className="font-mono"
        fontSize="12"
        letterSpacing="2"
        fill={GOLD}
        fillOpacity="0.75"
      >
        the coin
      </text>

      <text
        x="384"
        y="143"
        textAnchor="middle"
        className="font-heading"
        fontSize="30"
        fill={GOLD_HOT}
      >
        {right}
      </text>
      <text
        x="384"
        y="166"
        textAnchor="middle"
        className="font-mono"
        fontSize="12"
        letterSpacing="2"
        fill={GOLD}
        fillOpacity="0.75"
      >
        the barrel
      </text>

      <text
        x="280"
        y="147"
        textAnchor="middle"
        className="font-mono"
        fontSize="12"
        letterSpacing="2"
        fill={GOLD_HOT}
      >
        ONE
      </text>
      <text
        x="280"
        y="165"
        textAnchor="middle"
        className="font-mono"
        fontSize="12"
        letterSpacing="2"
        fill={GOLD_HOT}
      >
        POOL
      </text>

      {/* Both arrows straddle x=280, the midpoint of the two circles, and sit
          outside the rings so they never crowd the labels. */}
      <path
        d="M234 38c30-9 62-9 92 0"
        stroke={GOLD}
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#pool-arrow)"
      />
      <text
        x="280"
        y="20"
        textAnchor="middle"
        className="font-mono"
        fontSize="11"
        letterSpacing="2"
        fill={GOLD}
        fillOpacity="0.8"
      >
        BUY PULLS USO IN
      </text>

      <path
        d="M326 262c-30 9-62 9-92 0"
        stroke={GOLD}
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#pool-arrow)"
      />
      <text
        x="280"
        y="288"
        textAnchor="middle"
        className="font-mono"
        fontSize="11"
        letterSpacing="2"
        fill={GOLD}
        fillOpacity="0.8"
      >
        SELL PUSHES IT BACK OUT
      </text>
    </svg>
  );
}
