import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CaptionGenerator from "./pages/CaptionGenerator";
import CalendarPlanner from "./pages/CalendarPlanner";
import AnalyticsPage from "./pages/AnalyticsPage";
import TrendTracker from "./pages/TrendTracker";
import IdeaVault from "./pages/IdeaVault";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import LinkInBio from "./pages/LinkInBio";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/link/:username" element={<LinkInBio />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/captions" element={<CaptionGenerator />} />
        <Route path="/planner" element={<CalendarPlanner />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/trends" element={<TrendTracker />} />
        <Route path="/ideas" element={<IdeaVault />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/linkinbio" element={<LinkInBio />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
