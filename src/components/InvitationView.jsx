import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import MonthCalendar from "./MonthCalendar.jsx";
import { SectionRule, TemplateHeader } from "./TemplateArt.jsx";
import WeddingFX from "./WeddingFX.jsx";

function useCountdown(dateStr) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!dateStr) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [dateStr]);
  return useMemo(() => {
    if (!dateStr) return null;
    const target = new Date(`${dateStr}T00:00:00`).getTime();
    if (Number.isNaN(target)) return null;
    const diff = target - now;
    if (diff <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      done: false,
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [dateStr, now]);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isDarkHex(hex) {
  if (!hex || !hex.startsWith("#")) return false;
  const raw = hex.slice(1);
  const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  if (full.length !== 6) return false;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 96;
}

function Portrait({ person, compact }) {
  if (!person?.name && !person?.photo_url) return null;
  return (
    <div className="cd-person">
      <div className={`cd-portrait ${compact ? "is-sm" : ""}`}>
        {person.photo_url ? (
          <img src={person.photo_url} alt={person.name} />
        ) : (
          <span>{(person.name || "?").slice(0, 1)}</span>
        )}
      </div>
      <p className="cd-person-name">{person.name || "Name"}</p>
      {person.role ? <p className="cd-kicker">{person.role}</p> : null}
    </div>
  );
}

function Heading({ children }) {
  return (
    <div className="cd-heading">
      <h2>{children}</h2>
      <SectionRule />
    </div>
  );
}

export default function InvitationView({
  invitation,
  template,
  compact = false,
  animated = false,
  guestName = "",
  children,
}) {
  const colors = { ...(template?.colors || {}), ...(invitation?.theme_overrides || {}) };
  const couple = invitation?.couple || {};
  const p1 = couple.partner_one || {};
  const p2 = couple.partner_two || {};
  const wedding = invitation?.wedding || {};
  const events = (invitation?.events || []).filter((e) => e.name);
  const gallery = (invitation?.gallery || []).filter((g) => g.url);
  const countdown = useCountdown(wedding.date);
  const names = [p1.name, p2.name].filter(Boolean).join("  &  ") || invitation?.title || "Our Wedding";
  const layout = template?.layout || "ornate";
  const fonts = template?.fonts || {};
  const dark = isDarkHex(colors.background);
  const effects = animated
    ? (template?.effects || []).filter((e) => e !== "lights" && e !== "parrots")
    : [];
  const showFamilies = p1.family || p2.family || p1.bio || p2.bio;

  const style = {
    "--inv-primary": colors.primary || "#7A1F2B",
    "--inv-secondary": colors.secondary || "#C9A227",
    "--inv-bg": colors.background || "#F8F1E3",
    "--inv-accent": colors.accent || "#D4AF37",
    "--inv-text": colors.text || "#3B1418",
    "--inv-muted": colors.muted || "#EFE3C9",
    "--inv-heading": `"${fonts.heading || "EB Garamond"}", serif`,
    "--inv-body": `"${fonts.body || "Source Sans 3"}", sans-serif`,
    "--inv-script": `"${fonts.script || "Pinyon Script"}", cursive`,
  };

  return (
    <article
      className={`cd-stage layout-${layout} ${dark ? "is-dark" : ""} ${compact ? "is-compact" : ""}`}
      style={style}
    >
      {animated ? <WeddingFX effects={effects} compact={compact} /> : null}
      <div className="cd-phone">
        <div className="cd-card">
          <div className="cd-frame">
            <TemplateHeader layout={layout} compact={compact} />

            <p className="cd-kicker">The wedding of</p>
            <h1 className="cd-names">{names}</h1>
            {wedding.date ? <p className="cd-date">{formatDate(wedding.date)}</p> : <p className="cd-date">Date to be announced</p>}
            {wedding.time ? <p className="cd-meta">{wedding.time}</p> : null}
            {wedding.venue_name ? <p className="cd-meta">{wedding.venue_name}</p> : null}
            <SectionRule />

            {guestName ? (
              <p className="cd-welcome">
                Dear <em>{guestName}</em>
              </p>
            ) : null}
            {wedding.message ? <p className="cd-copy">{wedding.message}</p> : null}

            <section className="cd-section">
              <Heading>The couple</Heading>
              <div className="cd-couple">
                <Portrait person={p1} compact={compact} />
                <p className="cd-amp">&</p>
                <Portrait person={p2} compact={compact} />
              </div>
            </section>

            {showFamilies ? (
              <section className="cd-section">
                <Heading>The families</Heading>
                <div className="cd-families">
                  {[p1, p2].map((person, i) =>
                    person.name ? (
                      <div key={i} className="cd-family">
                        <p className="cd-kicker">{person.role || (i === 0 ? "Bride" : "Groom")}</p>
                        <p className="cd-family-name">{person.name}</p>
                        <p className="cd-copy">{person.family || person.bio}</p>
                      </div>
                    ) : null
                  )}
                </div>
              </section>
            ) : null}

            {countdown && !countdown.done ? (
              <section className="cd-section">
                <Heading>Counting down</Heading>
                <div className="cd-count">
                  {[
                    ["Days", countdown.days],
                    ["Hours", countdown.hours],
                    ["Mins", countdown.minutes],
                    ["Secs", countdown.seconds],
                  ].map(([label, value]) => (
                    <div key={label} className="cd-count-cell">
                      <p>{String(value).padStart(2, "0")}</p>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {wedding.date ? (
              <section className="cd-section">
                <Heading>Save the date</Heading>
                <MonthCalendar dateStr={wedding.date} />
              </section>
            ) : null}

            {wedding.story ? (
              <section className="cd-section">
                <Heading>Our story</Heading>
                <p className="cd-copy">{wedding.story}</p>
              </section>
            ) : null}

            {events.length ? (
              <section className="cd-section">
                <Heading>Celebrations</Heading>
                <div className="cd-events">
                  {events.map((event, i) => (
                    <article key={`${event.name}-${i}`} className="cd-event">
                      <p className="cd-event-name">{event.name}</p>
                      {event.date ? (
                        <p>
                          <Calendar size={14} /> {formatDate(event.date)}
                        </p>
                      ) : null}
                      {event.time ? (
                        <p>
                          <Clock size={14} /> {event.time}
                        </p>
                      ) : null}
                      {event.venue ? (
                        <p>
                          <MapPin size={14} /> {event.venue}
                        </p>
                      ) : null}
                      {event.description ? <p className="cd-copy">{event.description}</p> : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {gallery.length ? (
              <section className="cd-section">
                <Heading>Album</Heading>
                <div className="cd-gallery">
                  {gallery.map((item, i) => (
                    <figure key={`${item.url}-${i}`} className="cd-photo">
                      <img src={item.url} alt={item.caption || "Wedding photo"} />
                      {item.caption ? <figcaption>{item.caption}</figcaption> : null}
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {wedding.venue_name || wedding.venue_address ? (
              <section className="cd-section">
                <Heading>Venue</Heading>
                <p className="cd-venue-name">{wedding.venue_name}</p>
                {wedding.venue_address ? <p className="cd-copy">{wedding.venue_address}</p> : null}
                {wedding.map_url ? (
                  <a href={wedding.map_url} target="_blank" rel="noreferrer" className="cd-map-btn">
                    Open map
                  </a>
                ) : null}
              </section>
            ) : null}

            {children}

            <footer className="cd-foot">
              <SectionRule />
              <p className="cd-names is-sm">{names}</p>
              <p className="cd-kicker">With love, the families</p>
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}
