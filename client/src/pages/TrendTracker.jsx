import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Plus, Music, CheckCircle, X, ExternalLink, Trash2,
} from "lucide-react";
import { trends as trendsApi } from "../utils/api";

const categories = [
  "dance", "lip-sync", "transition", "challenge", "educational",
  "comedy", "aesthetic", "other",
];

export default function TrendTracker() {
  const [trends, setTrends] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ title: "", url: "", platform: "tiktok", category: "dance", notes: "" });

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      const { data } = await trendsApi.getAll();
      setTrends(data.trends || []);
    } catch { /* offline */ }
  };

  const handleSubmit = async () => {
    if (!form.title) return;
    try {
      await trendsApi.create(form);
      await loadTrends();
      setShowModal(false);
      setForm({ title: "", url: "", platform: "tiktok", category: "dance", notes: "" });
    } catch { /* offline */ }
  };

  const toggleUsed = async (trend) => {
    try {
      await trendsApi.update(trend._id, { used: !trend.used });
      await loadTrends();
    } catch { /* offline */ }
  };

  const handleDelete = async (id) => {
    try {
      await trendsApi.delete(id);
      await loadTrends();
    } catch { /* offline */ }
  };

  const filtered = filter === "all" ? trends : filter === "used" ? trends.filter((t) => t.used) : trends.filter((t) => !t.used);
  const usedCount = trends.filter((t) => t.used).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Trend Tracker</h1>
              <p className="text-sm text-gray-400">Save and organize trending sounds and formats</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm !py-2 !px-4 flex items-center gap-2">
            <Plus size={16} />
            Add Trend
          </button>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {["all", "unused", "used"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              filter === f
                ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                : "text-gray-400 hover:text-white border border-transparent"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === "all" && `(${trends.length})`}
            {f === "used" && `(${usedCount})`}
            {f === "unused" && `(${trends.length - usedCount})`}
          </button>
        ))}
      </motion.div>

      <motion.div
        className="grid gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <Music size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">No trends saved yet</p>
            <button onClick={() => setShowModal(true)} className="text-brand-400 text-sm mt-2 hover:text-brand-300">
              Add your first trend
            </button>
          </div>
        ) : (
          filtered.map((trend, i) => (
            <motion.div
              key={trend._id}
              className={`card flex items-center gap-4 ${
                trend.used ? "opacity-60" : ""
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                trend.used ? "bg-green-500/10" : "bg-brand-500/10"
              }`}>
                <Music size={20} className={trend.used ? "text-green-400" : "text-brand-400"} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${trend.used ? "line-through" : ""}`}>{trend.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 capitalize">{trend.category}</span>
                  <span className="capitalize">{trend.platform}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {trend.url && (
                  <a href={trend.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ExternalLink size={16} className="text-gray-400" />
                  </a>
                )}
                <button onClick={() => toggleUsed(trend)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <CheckCircle size={16} className={trend.used ? "text-green-400" : "text-gray-600"} />
                </button>
                <button onClick={() => handleDelete(trend._id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={16} className="text-gray-600 hover:text-red-400" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Add Trend</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trend Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Glow Up Transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Audio URL (optional)</label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="input-field"
                    placeholder="https://tiktok.com/..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                    <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="input-field">
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                      {categories.map((c) => (
                        <option key={c} value={c} className="capitalize">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="input-field h-20 resize-none"
                    placeholder="Any notes about this trend..."
                  />
                </div>
                <button onClick={handleSubmit} className="btn-primary w-full">
                  Add Trend
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
