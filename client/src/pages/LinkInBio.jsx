import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Link as LinkIcon, Plus, X, Instagram, Music2, Youtube, Twitter,
  Save, ExternalLink, Sparkles,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { linkinbio as linkinbioApi } from "../utils/api";

function AdminPanel() {
  const [data, setData] = useState({ links: [], socialLinks: {}, bio: "", profilePic: "", theme: "dark" });
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: res } = await linkinbioApi.get();
      setData(res.linkinbio || { links: [], socialLinks: {}, bio: "", theme: "dark" });
    } catch { /* ignore */ }
  };

  const addLink = () => {
    if (!newLink.title || !newLink.url) return;
    const link = { ...newLink, id: Date.now().toString() };
    setData({ ...data, links: [...data.links, link] });
    setNewLink({ title: "", url: "" });
  };

  const removeLink = (id) => {
    setData({ ...data, links: data.links.filter((l) => l.id !== id) });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await linkinbioApi.update(data);
      setMessage("Link-in-bio updated!");
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <LinkIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Link-in-Bio</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize your CreatorHub link page</p>
          </div>
        </div>
      </motion.div>

      {message && (
          <div className={`p-3 rounded-xl text-sm ${
            message.includes("updated") ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
          }`}>{message}</div>
      )}

      <motion.div className="card p-6 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Picture URL</label>
          <input
            type="url"
            value={data.profilePic}
            onChange={(e) => setData({ ...data, profilePic: e.target.value })}
            className="input-field"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
          <textarea
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
            className="input-field h-20 resize-none"
            placeholder="Your bio for the link page..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Social Links</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "instagram", icon: Instagram, label: "Instagram" },
              { key: "tiktok", icon: Music2, label: "TikTok" },
              { key: "youtube", icon: Youtube, label: "YouTube" },
              { key: "twitter", icon: Twitter, label: "Twitter" },
            ].map(({ key, icon: Icon, label }) => (
              <div key={key} className="flex items-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-white/5">
                <Icon size={18} className="text-gray-500 dark:text-gray-400" />
                <input
                  type="url"
                  value={data.socialLinks[key] || ""}
                  onChange={(e) => setData({ ...data, socialLinks: { ...data.socialLinks, [key]: e.target.value } })}
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none"
                  placeholder={`${label} URL`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Links</label>
            <span className="text-xs text-gray-500">{data.links.length}/10</span>
          </div>
          <div className="space-y-2 mb-4">
            {data.links.map((link) => (
              <div key={link.id} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <LinkIcon size={16} className="text-gray-500 shrink-0" />
                <span className="flex-1 min-w-0 text-sm truncate text-gray-900 dark:text-white">{link.title}</span>
                <span className="hidden sm:block text-xs text-gray-500 truncate max-w-[150px]">{link.url}</span>
                <button onClick={() => removeLink(link.id)} className="p-1 hover:bg-red-500/10 rounded-lg shrink-0">
                  <X size={14} className="text-gray-500 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="text" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} className="input-field flex-1" placeholder="Link title" />
            <input type="url" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} className="input-field flex-1" placeholder="https://..." />
            <button onClick={addLink} className="btn-primary !px-4 shrink-0">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={18} />
              Save Link Page
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}

function PublicPage() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [username]);

  const fetchUser = async () => {
    try {
      const { data } = await linkinbioApi.getPublic(username);
      setUserData(data.user);
    } catch { /* user not found */ }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-gray-400 mb-4">The user you're looking for doesn't exist.</p>
          <Link to="/" className="text-brand-400 hover:text-brand-300">Go home</Link>
        </div>
      </div>
    );
  }

  const { linkinbio, name, avatar } = userData;
  const theme = linkinbio?.theme || "dark";

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-950 text-white" : "bg-white text-gray-900"} flex flex-col items-center justify-center p-6`}>
      <div className="w-full max-w-md space-y-6 text-center">
        <img
          src={linkinbio?.profilePic || avatar || `https://ui-avatars.com/api/?name=${name}&background=4ade80&color=fff`}
          alt={name}
          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-brand-500/30"
        />
        <h1 className="text-xl font-bold">{name}</h1>
        {linkinbio?.bio && <p className="text-sm text-gray-400">{linkinbio.bio}</p>}

        {Object.entries(linkinbio?.socialLinks || {}).filter(([, v]) => v).length > 0 && (
          <div className="flex items-center justify-center gap-4">
            {linkinbio.socialLinks.instagram && (
              <a href={linkinbio.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 transition-colors">
                <Instagram size={22} className="text-pink-400" />
              </a>
            )}
            {linkinbio.socialLinks.tiktok && (
              <a href={linkinbio.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <Music2 size={22} />
              </a>
            )}
            {linkinbio.socialLinks.youtube && (
              <a href={linkinbio.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors">
                <Youtube size={22} className="text-red-400" />
              </a>
            )}
            {linkinbio.socialLinks.twitter && (
              <a href={linkinbio.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                <Twitter size={22} className="text-blue-400" />
              </a>
            )}
          </div>
        )}

        <div className="space-y-3">
          {(linkinbio?.links || []).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full p-4 rounded-2xl font-medium transition-all duration-200 flex items-center justify-between group ${
                theme === "dark"
                  ? "bg-white/5 hover:bg-white/10 border border-white/10"
                  : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <span>{link.title}</span>
              <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        <p className="text-xs text-gray-600 pt-8">
          Powered by{" "}
          <Link to="/" className="text-brand-400 hover:text-brand-300">CreatorHub</Link>
        </p>
      </div>
    </div>
  );
}

export default function LinkInBio() {
  const { username } = useParams();
  const user = useAuthStore((s) => s.user);

  if (username) return <PublicPage />;

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="text-center">
          <Sparkles size={48} className="mx-auto text-brand-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">CreatorHub Link-in-Bio</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your own link page</p>
          <Link to="/login" className="btn-primary">Sign In to Get Started</Link>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}
