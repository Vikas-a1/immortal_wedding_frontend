import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { api } from "../api/client";

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      setItems(await api.media());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    try {
      await api.upload(file);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await api.deleteMedia(id);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase text-[#7a4558]">Assets</p>
          <h1 className="display text-4xl md:text-5xl">Images</h1>
        </div>
        <label className="btn btn-primary">
          <Upload size={16} />
          Upload photo
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
        </label>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
            <img src={item.url} alt="" className="h-40 w-full object-cover" />
            <figcaption className="flex items-center justify-between gap-2 p-3 text-xs text-[#7a4558]">
              <span className="truncate">{item.filename}</span>
              <button type="button" onClick={() => remove(item.id)} aria-label="Delete image">
                <Trash2 size={14} />
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
      {!items.length ? (
        <p className="mt-10 text-[#7a4558]">Upload couple portraits, a hero image, and gallery photos here.</p>
      ) : null}
    </div>
  );
}
