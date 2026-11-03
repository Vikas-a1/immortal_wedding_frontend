export default function MonthCalendar({ dateStr }) {
  if (!dateStr) return null;
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = date.getMonth();
  const selected = date.getDate();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const label = date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <div className="cd-cal">
      <p className="cd-cal-label">{label}</p>
      <div className="cd-cal-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}-${i}`} className="cd-cal-dow">
            {d}
          </span>
        ))}
        {cells.map((day, i) => (
          <span key={i} className={day === selected ? "cd-cal-day is-on" : "cd-cal-day"}>
            {day || ""}
          </span>
        ))}
      </div>
    </div>
  );
}
