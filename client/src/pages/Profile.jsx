import { useState } from "react";
import { motion } from "framer-motion";
import { User, Save, Link as LinkIcon } from "lucide-react";
import useAuthStore from "../store/authStore";
import { auth as authApi } from "../utils/api";

const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => setMessage({ type, text });

  const handleSave = async () => {
    const avatar = form.avatar.trim();

    if (avatar && !isValidUrl(avatar)) {
      showMessage("error", "Please enter a valid image URL starting with http:// or https://.");
      return;
    }

    setSaving(true);
    showMessage("", "");
    try {
      const { data } = await authApi.updateProfile({ ...form, avatar });
      updateUser(data.user);
      setForm({ ...form, avatar });
      showMessage("success", "Profile updated successfully!");
    } catch (err) {
      showMessage("error", err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = form.avatar && isValidUrl(form.avatar) ? form.avatar : user?.avatar || "";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your public profile</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="card p-4 sm:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-3xl font-bold mb-4 overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</h2>
          <p className="text-sm text-gray-500">@{user?.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Paste a publicly accessible image URL below</p>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field" placeholder="username" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field h-24 resize-none" placeholder="Tell your story..." maxLength={150} />
            <p className="text-xs text-gray-500 mt-1">{form.bio.length}/150</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Avatar URL</label>
            <div className="relative">
              <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                value={form.avatar}
                onChange={(e) => {
                  setForm({ ...form, avatar: e.target.value });
                  if (message.type === "error") showMessage("", "");
                }}
                className="input-field pl-10"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty to use your default placeholder</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}