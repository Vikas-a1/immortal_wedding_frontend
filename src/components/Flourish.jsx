export default function Flourish({ color = "currentColor" }) {
  return (
    <svg className="inv-ornament" viewBox="0 0 120 18" fill="none" aria-hidden="true">
      <path
        d="M4 9h28M88 9h28"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M46 9c4-7 10-7 14 0 4 7 10 7 14 0"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="60" cy="9" r="2.2" fill={color} />
    </svg>
  );
}
