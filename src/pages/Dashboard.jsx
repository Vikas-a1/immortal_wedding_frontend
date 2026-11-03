import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Copy, Eye, Plus, Trash2 } from "lucide-react";
import { api } from "../api/client";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");
  const navigate = useNavigate();

  async function load() {
    try {
      const [invites, tpls] = await Promise.all([api.invitations(), api.templates()]);
      setItems(invites);
      setTemplates(tpls);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createNew() {
    setBusy(true);
    setError("");
    try {
      const created = await api.createInvitation({ title: "Our Wedding", template_id: "royal-red" });
      navigate(`/app/invitations/${created.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this invitation?")) return;
    await api.deleteInvitation(id);
    load();
  }

  async function copyLink(slug) {
    const url = `${window.location.origin}/i/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this invitation link", url);
    }
    setCopied(slug);
    setTimeout(() => setCopied(""), 1600);
  }

  function palette(item) {
    return templates.find((t) => t.slug === item.template_id)?.colors || {
      primary: "#7A1F2B",
      background: "#F8F1E3",
      muted: "#EFE3C9",
      accent: "#D4AF37",
      text: "#3B1418",
    };
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-[#7a4558]">Configuration centre</p>
          <h1 className="display text-4xl md:text-5xl">Your invitations</h1>
        </div>
        <button type="button" className="btn btn-primary" onClick={createNew} disabled={busy}>
          <Plus size={16} />
          New invitation
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const colors = palette(item);
          const url = `${typeof window !== "undefined" ? window.location.origin : ""}/i/${item.slug}`;
          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white shadow-sm"
            >
              <div
                className="relative px-6 py-8 text-center"
                style={{
                  background: `linear-gradient(160deg, ${colors.background}, ${colors.muted})`,
                  color: colors.text,
                }}
              >
                <p className="script text-4xl leading-none" style={{ color: colors.primary }}>
                  {item.title}
                </p>
                <p className="mt-2 text-[10px] tracking-[0.28em] uppercase opacity-70">{item.template_id}</p>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm text-[#7a4558]">{url}</p>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "published"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-[#7a4558]">
                  <Eye size={14} /> {item.views || 0} views
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to={`/app/invitations/${item.id}`} className="btn btn-primary !py-2">
                    Edit
                  </Link>
                  <button type="button" className="btn btn-ghost !py-2" onClick={() => copyLink(item.slug)}>
                    {copied === item.slug ? <Check size={14} /> : <Copy size={14} />}
                    {copied === item.slug ? "Copied" : "Copy link"}
                  </button>
                  <Link to={`/i/${item.slug}`} className="btn btn-ghost !py-2" target="_blank">
                    Open
                  </Link>
                  <button type="button" className="btn btn-ghost !py-2" onClick={() => remove(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {!items.length ? (
          <div className="rounded-3xl border border-dashed border-[var(--color-line)] bg-white/60 p-10 text-[#7a4558] md:col-span-2">
            No invitations yet. Create one, pick a template, and add your details.
          </div>
        ) : null}
      </div>
    </div>
  );
}
