const TOKEN_KEY = "immortal_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { json, form, method = "GET", auth = true } = {}) {
  const headers = {};
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  const options = { method, headers };
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(json);
  }
  if (form) {
    options.body = form;
  }
  const res = await fetch(path, options);
  if (res.status === 401 && auth) {
    setToken(null);
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text };
  }
  if (!res.ok) {
    const detail = data?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg || d).join(", ")
          : res.statusText;
    const error = new Error(message || "Request failed");
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  register: (body) => request("/api/auth/register", { method: "POST", json: body, auth: false }),
  login: (body) => request("/api/auth/login", { method: "POST", json: body, auth: false }),
  me: () => request("/api/auth/me"),
  templates: () => request("/api/templates"),
  invitations: () => request("/api/invitations"),
  createInvitation: (body) => request("/api/invitations", { method: "POST", json: body }),
  getInvitation: (id) => request(`/api/invitations/${id}`),
  saveInvitation: (id, body) => request(`/api/invitations/${id}`, { method: "PUT", json: body }),
  deleteInvitation: (id) => request(`/api/invitations/${id}`, { method: "DELETE" }),
  publishInvitation: (id, body) =>
    request(`/api/invitations/${id}/publish`, { method: "POST", json: body || {} }),
  rsvps: (id) => request(`/api/invitations/${id}/rsvps`),
  media: () => request("/api/media"),
  upload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return request("/api/media/upload", { method: "POST", form });
  },
  deleteMedia: (id) => request(`/api/media/${id}`, { method: "DELETE" }),
  publicInvitation: (slug) =>
    request(`/api/public/invitations/${slug}`, { auth: false }),
  rsvp: (slug, body) =>
    request(`/api/public/invitations/${slug}/rsvp`, {
      method: "POST",
      json: body,
      auth: false,
    }),
};
