import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { TemplateHeader } from "../components/TemplateArt.jsx";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [busy, setBusy] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    api.templates().then(setTemplates).catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const set = new Set(templates.map((t) => t.category));
    return ["All", ...Array.from(set).sort()];
  }, [templates]);

  const visible = templates.filter((tpl) => {
    const hay = `${tpl.name} ${tpl.description} ${tpl.category}`.toLowerCase();
    const matchesQuery = hay.includes(query.toLowerCase());
    const matchesCat = category === "All" || tpl.category === category;
    return matchesQuery && matchesCat;
  });

  async function useTemplate(slug) {
    setBusy(slug);
    try {
      const created = await api.createInvitation({ title: "Our Wedding", template_id: slug });
      navigate(`/app/invitations/${created.id}`);
    } finally {
      setBusy("");
    }
  }

  return (
    <div>
      <p className="text-xs tracking-[0.22em] uppercase text-[#7a4558]">Look and feel</p>
      <h1 className="display text-4xl md:text-5xl">Templates</h1>
      <p className="mt-2 max-w-2xl text-[#6b3d4e]">
        {templates.length} handcrafted invitation looks, cloned from the ChungDoi catalog styles. Switch anytime —
        your names and details stay.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <input
          className="w-full max-w-md rounded-full border border-[var(--color-line)] bg-white px-4 py-2.5"
          placeholder="Search templates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide ${
                category === cat ? "bg-[#9f1239] text-white" : "bg-white text-[#5c3344]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((tpl) => (
          <article key={tpl.slug} className="overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-white shadow-sm">
            <div
              className="tpl-phone"
              style={{
                background: tpl.colors.background,
                color: tpl.colors.text,
                "--inv-primary": tpl.colors.primary,
                "--inv-accent": tpl.colors.accent,
                "--inv-bg": tpl.colors.background,
                "--inv-script": `"${tpl.fonts?.script || "Pinyon Script"}", cursive`,
              }}
            >
              <TemplateHeader layout={tpl.layout} compact />
              <p className="cd-kicker" style={{ color: tpl.colors.secondary }}>
                {tpl.category}
              </p>
              <p
                className="mt-1 text-center leading-none"
                style={{
                  fontFamily: `"${tpl.fonts?.script || "Pinyon Script"}", cursive`,
                  fontSize: "2.4rem",
                  color: tpl.colors.primary,
                }}
              >
                A & B
              </p>
            </div>
            <div className="p-5">
              <h2 className="display text-2xl">{tpl.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6b3d4e]">{tpl.description}</p>
              <div className="mt-4 flex gap-2">
                {["primary", "secondary", "accent"].map((key) => (
                  <span
                    key={key}
                    className="h-6 w-6 rounded-full border border-black/5"
                    style={{ background: tpl.colors[key] }}
                  />
                ))}
              </div>
              <button
                type="button"
                className="btn btn-primary mt-5 w-full"
                disabled={busy === tpl.slug}
                onClick={() => useTemplate(tpl.slug)}
              >
                {busy === tpl.slug ? "Creating…" : "Use this template"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
