export function PumpField() {
  return (
    <div className="pump-field pointer-events-none" aria-hidden>
      <svg
        className="derrick-art"
        viewBox="0 0 200 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 18 L34 328 H166 Z"
          stroke="#f0b429"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M88 70 H112 M70 140 H130 M52 220 H148 M42 280 H158"
          stroke="#f0b429"
          strokeWidth="2"
          opacity="0.75"
        />
        <path
          d="M88 70 L70 140 L112 70 L130 140 L88 70 M70 140 L52 220 L130 140 L148 220 L70 140 M52 220 L42 280 L148 220 L158 280"
          stroke="#c4922a"
          strokeWidth="1.4"
          opacity="0.7"
        />
        <rect
          x="86"
          y="8"
          width="28"
          height="14"
          rx="1"
          stroke="#f0b429"
          strokeWidth="2"
        />
        <path d="M100 22 V300" stroke="#ffe08a" strokeWidth="1.6" opacity="0.8" />
        <rect
          x="92"
          y="168"
          width="16"
          height="22"
          stroke="#f0b429"
          strokeWidth="1.6"
        />
        <path d="M20 328 H180" stroke="#f0b429" strokeWidth="3" />
      </svg>

      <svg
        className="pumpjack-art"
        viewBox="0 0 520 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 338 H500" stroke="#f0b429" strokeWidth="3" />
        <path
          d="M168 338 H312"
          stroke="#c4922a"
          strokeWidth="10"
          strokeLinecap="square"
        />
        <path
          d="M188 338 L248 128 L292 338"
          stroke="#f0b429"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M204 338 L248 200 L276 338"
          stroke="#c4922a"
          strokeWidth="3"
          opacity="0.8"
        />
        <circle cx="248" cy="128" r="8" fill="#1a1208" stroke="#ffe08a" strokeWidth="3" />

        <g className="pump-beam">
          <path
            d="M72 108 H390"
            stroke="#f0b429"
            strokeWidth="8"
            strokeLinecap="square"
          />
          <path
            d="M88 88 C48 92 28 128 36 168 C58 150 78 138 96 132 L88 88 Z"
            fill="#1a1208"
            stroke="#ffe08a"
            strokeWidth="3"
          />
          <path d="M64 148 V262" className="pump-rod" stroke="#f0b429" strokeWidth="3" />
          <circle cx="64" cy="266" r="6" fill="#f0b429" />
          <circle cx="372" cy="128" r="6" fill="#f0b429" />
        </g>

        <g className="pump-crank">
          <circle
            cx="372"
            cy="286"
            r="42"
            stroke="#f0b429"
            strokeWidth="5"
          />
          <circle cx="372" cy="286" r="10" fill="#1a1208" stroke="#ffe08a" strokeWidth="3" />
          <path d="M372 286 L372 248" stroke="#f0b429" strokeWidth="6" />
          <circle cx="372" cy="244" r="9" fill="#c4922a" stroke="#ffe08a" strokeWidth="2" />
        </g>

        <path
          d="M372 128 L372 244"
          className="pump-pitman"
          stroke="#c4922a"
          strokeWidth="3.5"
        />
        <circle cx="64" cy="274" r="14" stroke="#f0b429" strokeWidth="2" opacity="0.6" />
        <path d="M50 338 H78" stroke="#f0b429" strokeWidth="6" />
      </svg>
    </div>
  );
}
