import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { User, Camera, Save, X } from "lucide-react";
import useAuthStore from "../store/authStore";
import { auth as authApi } from "../utils/api";
import {
  validateAvatarFile,
  uploadAvatar,
  removeStoredAvatar,
  AVATAR_TYPES,
  AVATAR_MAX_MB,
} from "../utils/upload";

const AVATAR_ACCEPT = AVATAR_TYPES.join(",");

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => setMessage({ type, text });

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const validationError = validateAvatarFile(file);
    if (validationError) {
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      showMessage("error", validationError);
      return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    showMessage("", "");
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    showMessage("", "");
  };

  const handleSave = async () => {
    setSaving(true);
    setUploadProgress(0);
    showMessage("", "");
    try {
      let avatarUrl = form.avatar;
      if (selectedFile) {
        avatarUrl = await uploadAvatar(selectedFile, setUploadProgress);
      }
      const { data } = await authApi.updateProfile({ ...form, avatar: avatarUrl });
      updateUser(data.user);
      if (selectedFile) {
        removeStoredAvatar(form.avatar);
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
        showMessage("success", "Profile picture updated successfully!");
      } else {
        showMessage("success", "Profile updated successfully!");
      }
    } catch (err) {
      showMessage("error", err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = previewUrl || form.avatar || "";
  const uploading = saving && selectedFile;

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
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-3xl font-bold mb-4 overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Change profile picture"
            >
              <Camera size={14} className="text-gray-500 dark:text-gray-300" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={AVATAR_ACCEPT}
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</h2>
          <p className="text-sm text-gray-500">@{user?.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">JPG, PNG, or WebP up to {AVATAR_MAX_MB} MB</p>
        </div>

        {selectedFile && (
          <div className="mb-4 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                New picture: {selectedFile.name}
              </p>
              {!saving && (
                <button
                  type="button"
                  onClick={clearSelectedFile}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X size={14} /> Remove
                </button>
              )}
            </div>
            {uploading ? (
              <div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">Preview shown above — click Save Changes to upload.</p>
            )}
          </div>
        )}

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
            <input type="url" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="input-field" placeholder="https://example.com/avatar.jpg" />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {uploading ? `Uploading ${uploadProgress}%...` : "Saving..."}
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