import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, Moon, Sun, Bell, Mail, Shield, CreditCard,
  Sparkles, Check,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import { auth as authApi } from "../utils/api";

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(
    user?.preferences?.emailNotifications ?? true
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const savePreferences = async () => {
    setSaving(true);
    setMessage("");
    try {
      const { data } = await authApi.updatePreferences({
        darkMode,
        emailNotifications: notifications,
      });
      updateUser(data.user);
      setMessage("Preferences saved!");
    } catch {
      setMessage("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <SettingsIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your preferences and account</p>
          </div>
        </div>
      </motion.div>

      {message && (
        <div className="p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-sm">
          {message}
        </div>
      )}

      <motion.div className="card p-6 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
          <Sun size={18} className="text-brand-500" />
          Appearance
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={20} className="text-purple-500" /> : <Sun size={20} className="text-orange-500" />}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-500">{darkMode ? "On" : "Off"}</p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                darkMode ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </motion.div>

      <motion.div className="card p-6 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
          <Bell size={18} className="text-brand-500" />
          Notifications
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-blue-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates about new features</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              notifications ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                notifications ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        <button onClick={savePreferences} disabled={saving} className="btn-primary w-full">
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </motion.div>

      <motion.div className="card p-6 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
          <Shield size={18} className="text-brand-500" />
          Plan
        </h3>
        <div className={`p-6 rounded-xl border ${
          user?.plan === "premium" ? "bg-brand-500/10 border-brand-500/30" : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-lg capitalize text-gray-900 dark:text-white">{user?.plan || "Free"} Plan</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.plan === "premium" ? "You have access to all features" : "Upgrade for unlimited access"}
              </p>
            </div>
            {user?.plan === "premium" && (
              <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                <Check size={20} className="text-brand-600 dark:text-brand-400" />
              </div>
            )}
          </div>

          <div className="space-y-2 mb-6">
            {[
              { feature: "AI Caption Generations", free: "10/month", premium: "Unlimited" },
              { feature: "Content Planner", free: "Basic", premium: "Full Calendar" },
              { feature: "Analytics", free: "7-day", premium: "90-day history" },
              { feature: "Trend Alerts", free: false, premium: true },
              { feature: "Idea Storage", free: "50", premium: "Unlimited" },
            ].map((item) => (
              <div key={item.feature} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
                <span className="text-gray-500 dark:text-gray-400">{item.feature}</span>
                <span className={`sm:text-right break-words ${user?.plan === "premium" ? "text-brand-600 dark:text-brand-400" : "text-gray-500"}`}>
                  {item.premium === true ? "✓" : item.premium === false ? "—" : `Free: ${item.free} | Premium: ${item.premium}`}
                </span>
              </div>
            ))}
          </div>

          {user?.plan !== "premium" && (
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <Sparkles size={18} />
              Upgrade to Premium
            </button>
          )}
        </div>
      </motion.div>

      <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
          <CreditCard size={18} className="text-brand-500" />
          Account
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
            <span className="text-gray-500 dark:text-gray-400 shrink-0">Email</span>
            <span className="text-gray-900 dark:text-white text-right break-all">{user?.email}</span>
          </div>
          <div className="flex justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
            <span className="text-gray-500 dark:text-gray-400 shrink-0">Member Since</span>
            <span className="text-gray-900 dark:text-white text-right">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
