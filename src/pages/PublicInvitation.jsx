import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import EnvelopeCover from "../components/EnvelopeCover.jsx";
import InvitationView from "../components/InvitationView.jsx";
import { SectionRule } from "../components/TemplateArt.jsx";

export default function PublicInvitation() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const guestName = params.get("to") || params.get("guest") || "";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    guest_name: guestName,
    email: "",
    attending: "yes",
    guests_count: 1,
    message: "",
  });

  useEffect(() => {
    api
      .publicInvitation(slug)
      .then(setData)
      .catch((err) => setError(err.status === 404 ? "This invitation is not published yet." : err.message));
  }, [slug]);

  const rsvpBlock = useMemo(() => {
    if (!data?.rsvp_enabled) return null;
    return (
      <section className="cd-section">
        <div className="cd-heading">
          <h2>Kindly reply</h2>
          <SectionRule />
        </div>
        {sent ? (
          <p className="cd-copy">Thank you. Your reply has been received.</p>
        ) : (
          <form
            className="cd-rsvp"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              try {
                await api.rsvp(slug, { ...form, guests_count: Number(form.guests_count) || 1 });
                setSent(true);
              } catch (err) {
                setError(err.message);
              }
            }}
          >
            {error ? <p className="text-sm text-red-800">{error}</p> : null}
            <div className="field">
              <label htmlFor="guest_name">Your name</label>
              <input
                id="guest_name"
                required
                value={form.guest_name}
                onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="field">
                <label htmlFor="attending">Attending</label>
                <select
                  id="attending"
                  value={form.attending}
                  onChange={(e) => setForm({ ...form, attending: e.target.value })}
                >
                  <option value="yes">Joyfully yes</option>
                  <option value="maybe">Hopefully</option>
                  <option value="no">Regretfully no</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="guests_count">Guests</label>
                <input
                  id="guests_count"
                  type="number"
                  min="1"
                  max="20"
                  value={form.guests_count}
                  onChange={(e) => setForm({ ...form, guests_count: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="message">A wish for the couple</label>
              <textarea
                id="message"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <button type="submit" className="cd-map-btn w-full border-0">
              Send RSVP
            </button>
          </form>
        )}
      </section>
    );
  }, [data, error, form, sent, slug]);

  if (error && !data) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <p className="script text-5xl text-[var(--color-primary)]">Immortal</p>
          <p className="mt-4 text-[#6b3d4e]">{error}</p>
          <Link to="/" className="btn btn-ghost mt-6">
            Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="grid min-h-screen place-items-center text-[#7a4558]">Opening invitation…</div>;
  }

  if (!open) {
    return (
      <EnvelopeCover invitation={data} template={data.template} guestName={guestName} onOpen={() => setOpen(true)} />
    );
  }

  return (
    <div className="invite-open">
      <InvitationView invitation={data} template={data.template} animated guestName={guestName}>
        {rsvpBlock}
      </InvitationView>
    </div>
  );
}
