import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard, Sparkles, Calendar, BarChart3, TrendingUp, Lightbulb,
  User, Settings, Link, LogOut, Menu, X, Sun, Moon,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/captions", icon: Sparkles, label: "Captions" },
  { to: "/planner", icon: Calendar, label: "Planner" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/trends", icon: TrendingUp, label: "Trends" },
  { to: "/ideas", icon: Lightbulb, label: "Ideas" },
  { to: "/linkinbio", icon: Link, label: "Link-in-Bio" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white dark:bg-gray-900/95 border-r border-gray-200 dark:border-gray-800/50
          flex flex-col transition-colors duration-300
        `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              <span className="gradient-text">Creator</span>Hub
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800/50 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-sm font-medium text-brand-600 dark:text-brand-400">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-900 dark:text-white">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
