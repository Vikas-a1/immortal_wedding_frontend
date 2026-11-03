import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Images, LayoutDashboard, LayoutTemplate, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/app/media", label: "Images", icon: Images },
];

export default function Shell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--color-line)] bg-white/80 px-5 py-4 backdrop-blur lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <button
          type="button"
          className="script text-4xl text-[var(--color-primary)]"
          onClick={() => navigate("/app")}
        >
          Immortal
        </button>
        <p className="mt-1 hidden text-xs tracking-[0.2em] uppercase text-[#7a4558] lg:block">
          Configuration centre
        </p>
        <nav className="mt-4 flex gap-2 overflow-x-auto lg:mt-10 lg:flex-col">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#9f1239] text-white shadow-md"
                    : "text-[#5c3344] hover:bg-[var(--color-muted)]"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 flex items-center justify-between gap-3 lg:mt-16 lg:flex-col lg:items-stretch">
          <p className="truncate text-sm text-[#7a4558]">{user?.name}</p>
          <button
            type="button"
            className="btn btn-ghost !px-3 !py-2 text-sm"
            onClick={() => {
              signOut();
              navigate("/");
            }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="px-4 py-6 md:px-8 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
