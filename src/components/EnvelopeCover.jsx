import { useState } from "react";
import { TemplateHeader } from "./TemplateArt.jsx";

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

export default function EnvelopeCover({ invitation, template, guestName = "", onOpen }) {
  const [opening, setOpening] = useState(false);
  const couple = invitation?.couple || {};
  const p1 = couple.partner_one?.name;
  const p2 = couple.partner_two?.name;
  const names = [p1, p2].filter(Boolean).join("  &  ") || invitation?.title || "Our Wedding";
  const colors = { ...(template?.colors || {}), ...(invitation?.theme_overrides || {}) };
  const layout = template?.layout || "ornate";
  const fonts = template?.fonts || {};
  const dark = isDarkHex(colors.background);

  function open() {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 780);
  }

  return (
    <div
      className={`cd-env-stage layout-${layout} ${dark ? "is-dark" : ""}`}
      style={{
        "--inv-primary": colors.primary || "#7A1F2B",
        "--inv-secondary": colors.secondary || "#C9A227",
        "--inv-accent": colors.accent || "#D4AF37",
        "--inv-bg": colors.background || "#F8F1E3",
        "--inv-text": colors.text || "#3B1418",
        "--inv-muted": colors.muted || "#EFE3C9",
        "--inv-heading": `"${fonts.heading || "EB Garamond"}", serif`,
        "--inv-script": `"${fonts.script || "Pinyon Script"}", cursive`,
      }}
    >
      <button type="button" className={`cd-envelope ${opening ? "is-opening" : ""}`} onClick={open}>
        <div className="cd-env-back" />
        <div className="cd-env-letter" aria-hidden={opening ? undefined : true}>
          <TemplateHeader layout={layout} compact />
          <p className="cd-kicker">You are invited</p>
          <h1 className="cd-names is-sm">{names}</h1>
        </div>
        <div className="cd-env-flap" />
        <div className="cd-env-front">
          <p className="cd-kicker">A wedding invitation</p>
          <h2 className="cd-names is-md">{names}</h2>
          {guestName ? (
            <p className="cd-welcome">
              For <em>{guestName}</em>
            </p>
          ) : (
            <p className="cd-meta">Tap the seal to open</p>
          )}
          {invitation?.wedding?.date ? <p className="cd-date">{invitation.wedding.date}</p> : null}
          <span className="wax-seal">
            <span>Open</span>
          </span>
        </div>
      </button>
    </div>
  );
}
