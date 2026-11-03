import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Shell from "./components/Shell.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Templates from "./pages/Templates.jsx";
import MediaLibrary from "./pages/MediaLibrary.jsx";
import InvitationEditor from "./pages/InvitationEditor.jsx";
import PublicInvitation from "./pages/PublicInvitation.jsx";

function Guard({ children }) {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-[#7a4558]">
        Opening the configuration centre…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/i/:slug" element={<PublicInvitation />} />
      <Route
        path="/app"
        element={
          <Guard>
            <Shell />
          </Guard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="templates" element={<Templates />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="invitations/:id" element={<InvitationEditor />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
