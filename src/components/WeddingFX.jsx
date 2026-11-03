function Butterfly({ i, color }) {
  const style = {
    left: `${8 + (i * 17) % 84}%`,
    animationDelay: `${i * 1.4}s`,
    animationDuration: `${14 + (i % 5) * 2}s`,
    color,
  };
  return (
    <span className="fx-fly" style={style} aria-hidden="true">
      <svg className="fx-butterfly" viewBox="0 0 64 48" width="42" height="32">
        <g className="fx-wing fx-wing-l">
          <path
            d="M30 24C18 8 4 10 6 22c2 10 12 12 24 4Z"
            fill="currentColor"
            opacity="0.85"
          />
          <path d="M28 22c-6-8-14-6-12 2 2 6 8 7 12 2Z" fill="#fff" opacity="0.35" />
        </g>
        <g className="fx-wing fx-wing-r">
          <path
            d="M34 24C46 8 60 10 58 22c-2 10-12 12-24 4Z"
            fill="currentColor"
            opacity="0.85"
          />
          <path d="M36 22c6-8 14-6 12 2-2 6-8 7-12 2Z" fill="#fff" opacity="0.35" />
        </g>
        <ellipse cx="32" cy="24" rx="2.2" ry="7" fill="#3b1418" />
      </svg>
    </span>
  );
}

function Petals() {
  return (
    <div className="fx-petals" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className="fx-petal"
          style={{
            left: `${(i * 7 + 4) % 96}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${10 + (i % 4) * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function WeddingFX({ effects = [], compact = false }) {
  if (compact) return null;
  const set = new Set((effects || []).filter((e) => e !== "lights" && e !== "parrots"));
  const showButterflies = set.has("butterflies");
  const showPetals = set.has("petals");
  if (!showButterflies && !showPetals) return null;
  return (
    <div className="wedding-fx" aria-hidden="true">
      {showPetals ? <Petals /> : null}
      {showButterflies
        ? [0, 1, 2, 3].map((i) => <Butterfly key={i} i={i} color="#db2777" />)
        : null}
    </div>
  );
}
