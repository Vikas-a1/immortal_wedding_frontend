/** Decorative frames inspired by ChungDoi Royal, Spring Garden, and Dragon Phoenix. */

export function FloralFrame({ compact }) {
  const h = compact ? 150 : 210;
  return (
    <svg className="cd-art-top" viewBox="0 0 420 220" height={h} aria-hidden="true">
      <path
        d="M30 200 C40 120 90 40 210 36 C330 40 380 120 390 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.85"
      />
      <path d="M210 20 C200 70 160 90 210 120 C260 90 220 70 210 20Z" fill="currentColor" opacity="0.55" />
      <path d="M70 150 C90 110 130 120 120 160 C100 170 80 170 70 150Z" fill="currentColor" opacity="0.4" />
      <path d="M350 150 C330 110 290 120 300 160 C320 170 340 170 350 150Z" fill="currentColor" opacity="0.4" />
      <circle cx="210" cy="128" r="4" fill="currentColor" />
    </svg>
  );
}

export function LeafSpray({ compact }) {
  const h = compact ? 120 : 170;
  return (
    <svg className="cd-art-top" viewBox="0 0 420 180" height={h} aria-hidden="true">
      <path d="M20 160 C80 40 160 30 210 70 C260 30 340 40 400 160" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {[40, 90, 140, 280, 330, 380].map((x, i) => (
        <ellipse
          key={x}
          cx={x}
          cy={70 + (i % 3) * 18}
          rx="14"
          ry="28"
          transform={`rotate(${i % 2 ? 25 : -25} ${x} ${80})`}
          fill="currentColor"
          opacity="0.35"
        />
      ))}
    </svg>
  );
}

export function DragonMedallion({ compact }) {
  const h = compact ? 140 : 200;
  return (
    <svg className="cd-art-top" viewBox="0 0 420 220" height={h} aria-hidden="true">
      <circle cx="210" cy="110" r="72" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="210" cy="110" r="62" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <text x="210" y="128" textAnchor="middle" fontSize="54" fill="currentColor" fontFamily="'Noto Serif SC', serif">
        囍
      </text>
      <path d="M40 40 C90 90 70 160 40 190" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M380 40 C330 90 350 160 380 190" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function BaroqueCartouche({ compact }) {
  const h = compact ? 130 : 180;
  return (
    <svg className="cd-art-top" viewBox="0 0 420 190" height={h} aria-hidden="true">
      <path
        d="M60 160 C60 40 360 40 360 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M90 160 C90 70 330 70 330 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.7"
      />
      <path d="M210 28 l8 18 h20 l-16 12 6 18-18-12-18 12 6-18-16-12 h20Z" fill="currentColor" />
    </svg>
  );
}

export function PalaceArch({ compact }) {
  const h = compact ? 140 : 190;
  return (
    <svg className="cd-art-top" viewBox="0 0 420 200" height={h} aria-hidden="true">
      <path d="M50 190 V90 A160 160 0 0 1 370 90 V190" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M80 190 V100 A130 130 0 0 1 340 100 V190" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="210" cy="48" r="6" fill="currentColor" />
    </svg>
  );
}

export function GlassOval({ compact }) {
  const h = compact ? 110 : 150;
  return (
    <svg className="cd-art-top" viewBox="0 0 420 160" height={h} aria-hidden="true">
      <ellipse cx="210" cy="90" rx="150" ry="52" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="210" cy="90" rx="138" ry="42" fill="currentColor" opacity="0.08" />
    </svg>
  );
}

export function SectionRule() {
  return (
    <svg className="cd-rule" viewBox="0 0 220 18" aria-hidden="true">
      <path d="M8 9 H90" stroke="currentColor" strokeWidth="1" />
      <circle cx="110" cy="9" r="3" fill="currentColor" />
      <path d="M130 9 H212" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function TemplateHeader({ layout, compact }) {
  if (["royal", "ornate", "silk", "brocade"].includes(layout)) return <FloralFrame compact={compact} />;
  if (["garden", "blossom", "boho", "dried", "calla", "folk"].includes(layout)) return <LeafSpray compact={compact} />;
  if (["dragon", "phoenix", "crane"].includes(layout)) return <DragonMedallion compact={compact} />;
  if (["baroque", "chateau"].includes(layout)) return <BaroqueCartouche compact={compact} />;
  if (["palace"].includes(layout)) return <PalaceArch compact={compact} />;
  if (["glass", "crystal"].includes(layout)) return <GlassOval compact={compact} />;
  if (["heritage", "lotus"].includes(layout)) return <DragonMedallion compact={compact} />;
  return <FloralFrame compact={compact} />;
}
