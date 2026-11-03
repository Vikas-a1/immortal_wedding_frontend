import { Link } from "react-router-dom";
import { Heart, Image, Link2, Palette } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const steps = [
  {
    icon: Palette,
    title: "Choose a template",
    copy: "Royal maroon, garden ivory, midnight navy, blush, or heritage terracotta.",
  },
  {
    icon: Image,
    title: "Add your story",
    copy: "Names, dates, venues, photos, and every ceremony you want guests to remember.",
  },
  {
    icon: Link2,
    title: "Send one URL",
    copy: "Publish and share a link. Guests open it on any phone. RSVPs come back to you.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <p className="script text-4xl text-[var(--color-primary)]">Immortal</p>
        <div className="flex gap-3">
          {user ? (
            <Link to="/app" className="btn btn-primary">
              Configuration centre
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Create invitation
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-10 md:pt-16">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#f9c5d5] blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -left-16 top-40 h-56 w-56 rounded-full bg-[#ead7a5] blur-3xl opacity-60" />
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs tracking-[0.22em] uppercase text-[#7a4558]">
          <Heart size={13} /> Wedding invitations, as a website
        </p>
        <h1 className="display max-w-3xl text-5xl leading-[1.05] text-[var(--color-ink)] md:text-7xl">
          Send a living invitation, not another card.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#6b3d4e]">
          Design a beautiful page for your wedding, then share one URL with relatives, friends,
          and family. Update photos, timings, and RSVPs without reprinting a thing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={user ? "/app" : "/register"} className="btn btn-primary">
            Open the configuration centre
          </Link>
          <Link to="/login" className="btn btn-ghost">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-24 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="rounded-3xl border border-[var(--color-line)] bg-white/80 p-7 shadow-sm">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-[#fce7f0] text-[var(--color-primary)]">
              <Icon size={18} />
            </div>
            <h2 className="display text-2xl">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6b3d4e]">{copy}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
