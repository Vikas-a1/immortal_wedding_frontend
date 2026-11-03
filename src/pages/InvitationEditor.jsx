import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Copy, Plus, Trash2, Upload } from "lucide-react";
import { api } from "../api/client";
import InvitationView from "../components/InvitationView.jsx";

const TABS = ["Couple", "Details", "Events", "Gallery", "Design", "Share"];

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export default function InvitationEditor() {
  const { id } = useParams();
  const [invitation, setInvitation] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [media, setMedia] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [tab, setTab] = useState("Couple");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tplQuery, setTplQuery] = useState("");

  useEffect(() => {
    Promise.all([api.getInvitation(id), api.templates(), api.media(), api.rsvps(id)])
      .then(([inv, tpls, files, replies]) => {
        setInvitation(inv);
        setTemplates(tpls);
        setMedia(files);
        setRsvps(replies);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    if (tab !== "Share") return undefined;
    api.rsvps(id).then(setRsvps).catch(() => {});
    return undefined;
  }, [tab, id]);

  const template = useMemo(
    () => templates.find((t) => t.slug === invitation?.template_id) || templates[0],
    [templates, invitation]
  );

  function patch(path, value) {
    setInvitation((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i += 1) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function save(extra = {}) {
    setError("");
    setStatus("Saving…");
    try {
      const payload = {
        title: invitation.title,
        template_id: invitation.template_id,
        slug: invitation.slug,
        couple: invitation.couple,
        wedding: invitation.wedding,
        events: invitation.events,
        gallery: invitation.gallery,
        hero_image: invitation.hero_image,
        theme_overrides: invitation.theme_overrides || {},
        rsvp_enabled: invitation.rsvp_enabled,
        ...extra,
      };
      const saved = await api.saveInvitation(id, payload);
      setInvitation(saved);
      setStatus("Saved");
    } catch (err) {
      setError(err.message);
      setStatus("");
    }
  }

  async function publish() {
    await save();
    try {
      const published = await api.publishInvitation(id, { slug: invitation.slug });
      setInvitation(published);
      setRsvps(await api.rsvps(id));
      setStatus("Published");
    } catch (err) {
      setError(err.message);
    }
  }

  async function uploadAndSet(file, setter) {
    const uploaded = await api.upload(file);
    setMedia((prev) => [uploaded, ...prev]);
    setter(uploaded.url);
  }

  async function copyUrl() {
    const url = `${window.location.origin}/i/${invitation.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!invitation) {
    return <p className="text-[#7a4558]">{error || "Loading invitation…"}</p>;
  }

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/i/${invitation.slug}`;

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_400px] 2xl:items-start">
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link to="/app" className="text-sm text-[#7a4558]">
              ← Dashboard
            </Link>
            <h1 className="display text-4xl">{invitation.title || "Invitation"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => save()}>
              Save draft
            </button>
            <button type="button" className="btn btn-primary" onClick={publish}>
              Publish
            </button>
          </div>
        </div>
        <p className="mt-2 min-h-6 text-sm text-[#7a4558]">
          {error ? <span className="text-red-700">{error}</span> : status}
        </p>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((name) => (
            <button
              key={name}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                tab === name ? "bg-[#9f1239] text-white" : "bg-white text-[#5c3344]"
              }`}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4 rounded-3xl border border-[var(--color-line)] bg-white p-5 md:p-6">
          {tab === "Couple" ? (
            <>
              <Field label="Invitation title">
                <input value={invitation.title} onChange={(e) => patch("title", e.target.value)} />
              </Field>
              {["partner_one", "partner_two"].map((key, idx) => {
                const person = invitation.couple[key];
                return (
                  <div key={key} className="grid gap-3 rounded-2xl bg-[var(--color-bg)] p-4 md:grid-cols-2">
                    <p className="display text-xl md:col-span-2">{idx === 0 ? "Partner one" : "Partner two"}</p>
                    <Field label="Name">
                      <input value={person.name} onChange={(e) => patch(`couple.${key}.name`, e.target.value)} />
                    </Field>
                    <Field label="Role">
                      <input value={person.role} onChange={(e) => patch(`couple.${key}.role`, e.target.value)} />
                    </Field>
                    <Field label="Family">
                      <input
                        value={person.family || ""}
                        placeholder="Parents of the bride"
                        onChange={(e) => patch(`couple.${key}.family`, e.target.value)}
                      />
                    </Field>
                    <Field label="Short bio">
                      <textarea
                        rows={3}
                        value={person.bio}
                        onChange={(e) => patch(`couple.${key}.bio`, e.target.value)}
                      />
                    </Field>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a4558]">Portrait</p>
                      {person.photo_url ? (
                        <img src={person.photo_url} alt="" className="mb-2 h-24 w-24 rounded-full object-cover" />
                      ) : null}
                      <label className="btn btn-ghost !py-2">
                        <Upload size={14} /> Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (file) uploadAndSet(file, (url) => patch(`couple.${key}.photo_url`, url));
                          }}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}

          {tab === "Details" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Wedding date">
                <input
                  type="date"
                  value={invitation.wedding.date}
                  onChange={(e) => patch("wedding.date", e.target.value)}
                />
              </Field>
              <Field label="Time">
                <input value={invitation.wedding.time} onChange={(e) => patch("wedding.time", e.target.value)} />
              </Field>
              <Field label="Venue name">
                <input
                  value={invitation.wedding.venue_name}
                  onChange={(e) => patch("wedding.venue_name", e.target.value)}
                />
              </Field>
              <Field label="Map URL">
                <input
                  value={invitation.wedding.map_url}
                  onChange={(e) => patch("wedding.map_url", e.target.value)}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Venue address">
                  <input
                    value={invitation.wedding.venue_address}
                    onChange={(e) => patch("wedding.venue_address", e.target.value)}
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Welcome message">
                  <textarea
                    rows={3}
                    value={invitation.wedding.message}
                    onChange={(e) => patch("wedding.message", e.target.value)}
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Your story">
                  <textarea
                    rows={5}
                    value={invitation.wedding.story}
                    onChange={(e) => patch("wedding.story", e.target.value)}
                  />
                </Field>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a4558]">Hero image</p>
                {invitation.hero_image ? (
                  <img src={invitation.hero_image} alt="" className="mb-2 h-28 w-full rounded-2xl object-cover" />
                ) : null}
                <label className="btn btn-ghost !py-2">
                  <Upload size={14} /> Upload hero
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) uploadAndSet(file, (url) => patch("hero_image", url));
                    }}
                  />
                </label>
              </div>
            </div>
          ) : null}

          {tab === "Events" ? (
            <div className="space-y-4">
              {(invitation.events || []).map((event, index) => (
                <div key={index} className="grid gap-3 rounded-2xl bg-[var(--color-bg)] p-4 md:grid-cols-2">
                  <Field label="Event name">
                    <input
                      value={event.name}
                      onChange={(e) => {
                        const events = [...invitation.events];
                        events[index] = { ...event, name: e.target.value };
                        patch("events", events);
                      }}
                    />
                  </Field>
                  <Field label="Date">
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => {
                        const events = [...invitation.events];
                        events[index] = { ...event, date: e.target.value };
                        patch("events", events);
                      }}
                    />
                  </Field>
                  <Field label="Time">
                    <input
                      value={event.time}
                      onChange={(e) => {
                        const events = [...invitation.events];
                        events[index] = { ...event, time: e.target.value };
                        patch("events", events);
                      }}
                    />
                  </Field>
                  <Field label="Venue">
                    <input
                      value={event.venue}
                      onChange={(e) => {
                        const events = [...invitation.events];
                        events[index] = { ...event, venue: e.target.value };
                        patch("events", events);
                      }}
                    />
                  </Field>
                  <div className="md:col-span-2 flex items-end gap-3">
                    <div className="flex-1">
                      <Field label="Description">
                        <textarea
                          rows={2}
                          value={event.description}
                          onChange={(e) => {
                            const events = [...invitation.events];
                            events[index] = { ...event, description: e.target.value };
                            patch("events", events);
                          }}
                        />
                      </Field>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost mb-1"
                      onClick={() => patch("events", invitation.events.filter((_, i) => i !== index))}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  patch("events", [
                    ...invitation.events,
                    { name: "", date: "", time: "", venue: "", description: "" },
                  ])
                }
              >
                <Plus size={14} /> Add event
              </button>
            </div>
          ) : null}

          {tab === "Gallery" ? (
            <div>
              <label className="btn btn-primary">
                <Upload size={14} /> Add photos
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    const uploaded = await api.upload(file);
                    setMedia((prev) => [uploaded, ...prev]);
                    patch("gallery", [...(invitation.gallery || []), { url: uploaded.url, caption: "" }]);
                  }}
                />
              </label>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(invitation.gallery || []).map((item, index) => (
                  <div key={`${item.url}-${index}`} className="rounded-2xl border border-[var(--color-line)] p-3">
                    <img src={item.url} alt="" className="h-32 w-full rounded-xl object-cover" />
                    <input
                      className="mt-2 w-full rounded-xl border border-[var(--color-line)] px-3 py-2 text-sm"
                      placeholder="Caption"
                      value={item.caption}
                      onChange={(e) => {
                        const gallery = [...invitation.gallery];
                        gallery[index] = { ...item, caption: e.target.value };
                        patch("gallery", gallery);
                      }}
                    />
                    <button
                      type="button"
                      className="mt-2 text-sm text-red-700"
                      onClick={() => patch("gallery", invitation.gallery.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              {media.length ? (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a4558]">
                    From your library
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {media.map((file) => (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() =>
                          patch("gallery", [...(invitation.gallery || []), { url: file.url, caption: "" }])
                        }
                      >
                        <img src={file.url} alt="" className="h-16 w-full rounded-lg object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === "Design" ? (
            <div className="space-y-5">
              <input
                className="w-full rounded-full border border-[var(--color-line)] px-4 py-2.5"
                placeholder="Search ChungDoi-style templates"
                value={tplQuery}
                onChange={(e) => setTplQuery(e.target.value)}
              />
              <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                {templates
                  .filter((tpl) =>
                    `${tpl.name} ${tpl.category} ${tpl.description}`.toLowerCase().includes(tplQuery.toLowerCase())
                  )
                  .map((tpl) => (
                  <button
                    key={tpl.slug}
                    type="button"
                    onClick={() => patch("template_id", tpl.slug)}
                    className={`rounded-2xl border p-4 text-left ${
                      invitation.template_id === tpl.slug
                        ? "border-[#9f1239] ring-2 ring-[#9f1239]/20"
                        : "border-[var(--color-line)]"
                    }`}
                  >
                    <p className="display text-xl">{tpl.name}</p>
                    <p className="mt-1 text-xs text-[#7a4558]">{tpl.category}</p>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {["primary", "accent", "background"].map((key) => (
                  <Field key={key} label={`${key} colour`}>
                    <input
                      type="color"
                      value={invitation.theme_overrides?.[key] || template?.colors?.[key] || "#9f1239"}
                      onChange={(e) =>
                        patch("theme_overrides", {
                          ...(invitation.theme_overrides || {}),
                          [key]: e.target.value,
                        })
                      }
                    />
                  </Field>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "Share" ? (
            <div className="space-y-5">
              <Field label="Public URL slug">
                <div className="flex gap-2">
                  <span className="grid place-items-center rounded-xl bg-[var(--color-muted)] px-3 text-sm text-[#7a4558]">
                    /i/
                  </span>
                  <input value={invitation.slug} onChange={(e) => patch("slug", e.target.value)} />
                </div>
              </Field>
              <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--color-bg)] p-4">
                <p className="flex-1 truncate text-sm">{publicUrl}</p>
                <button type="button" className="btn btn-ghost !py-2" onClick={copyUrl}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy link"}
                </button>
                {invitation.status === "published" ? (
                  <a href={publicUrl} className="btn btn-primary !py-2" target="_blank" rel="noreferrer">
                    Open
                  </a>
                ) : (
                  <p className="text-sm text-[#7a4558]">Publish to make this URL live.</p>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!invitation.rsvp_enabled}
                  onChange={(e) => patch("rsvp_enabled", e.target.checked)}
                />
                Collect RSVPs on the invitation
              </label>
              <div>
                <h2 className="display text-2xl">RSVPs</h2>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider text-[#7a4558]">
                        <th className="py-2">Guest</th>
                        <th>Attending</th>
                        <th>Party</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rsvps.map((row) => (
                        <tr key={row.id} className="border-t border-[var(--color-line)]">
                          <td className="py-2">{row.guest_name}</td>
                          <td>{row.attending}</td>
                          <td>{row.guests_count}</td>
                          <td>{row.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!rsvps.length ? <p className="mt-3 text-sm text-[#7a4558]">No replies yet.</p> : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="min-w-0 xl:sticky xl:top-6 h-fit overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white shadow-lg">
        <p className="border-b border-[var(--color-line)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a4558]">
          Live preview
        </p>
        <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <InvitationView invitation={invitation} template={template} compact />
        </div>
      </aside>
    </div>
  );
}
