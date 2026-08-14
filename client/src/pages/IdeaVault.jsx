import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, Plus, Search, Trash2, X, Edit3, Film, FileText, Repeat,
  Zap, Archive,
} from "lucide-react";
import { ideas as ideasApi } from "../utils/api";

const typeIcons = {
  video: { icon: Film, color: "text-blue-400" },
  script: { icon: FileText, color: "text-green-400" },
  hook: { icon: Zap, color: "text-yellow-400" },
  transition: { icon: Repeat, color: "text-purple-400" },
  concept: { icon: Lightbulb, color: "text-orange-400" },
  other: { icon: Archive, color: "text-gray-400" },
};

export default function IdeaVault() {
  const [ideas, setIdeas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [form, setForm] = useState({ title: "", description: "", type: "video", tags: "", status: "draft" });

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const { data } = await ideasApi.getAll();
      setIdeas(data.ideas || []);
    } catch { /* offline */ }
  };

  const handleSubmit = async () => {
    if (!form.title) return;
    try {
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        status: form.status,
      };
      if (editing) {
        await ideasApi.update(editing._id, payload);
      } else {
        await ideasApi.create(payload);
      }
      await loadIdeas();
      setShowModal(false);
      setEditing(null);
      setForm({ title: "", description: "", type: "video", tags: "", status: "draft" });
    } catch { /* offline */ }
  };

  const handleEdit = (idea) => {
    setEditing(idea);
    setForm({
      title: idea.title,
      description: idea.description || "",
      type: idea.type,
      tags: (idea.tags || []).join(", "),
      status: idea.status || "draft",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await ideasApi.delete(id);
      await loadIdeas();
    } catch { /* offline */ }
  };

  const filtered = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.description?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || idea.type === filterType;
    return matchesSearch && matchesType;
  });

  const types = ["all", "video", "script", "hook", "transition", "concept", "other"];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0">
              <Lightbulb size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold">Idea Vault</h1>
              <p className="text-sm text-gray-400">Never lose a content idea again</p>
            </div>
          </div>
          <button onClick={() => { setEditing(null); setForm({ title: "", description: "", type: "video", tags: "" }); setShowModal(true); }} className="btn-primary text-sm !py-2 !px-4 flex items-center gap-2 shrink-0">
            <Plus size={16} />
            New Idea
          </button>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center gap-4 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
            placeholder="Search ideas..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                filterType === t
                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                  : "text-gray-400 hover:text-white border border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <Lightbulb size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">{search || filterType !== "all" ? "No ideas match your search" : "No ideas yet"}</p>
            <button onClick={() => { setEditing(null); setForm({ title: "", description: "", type: "video", tags: "" }); setShowModal(true); }} className="text-brand-400 text-sm mt-2 hover:text-brand-300">
              Add your first idea
            </button>
          </div>
        ) : (
          filtered.map((idea, i) => {
            const TypeIcon = typeIcons[idea.type]?.icon || Lightbulb;
            const iconColor = typeIcons[idea.type]?.color || "text-gray-400";

            return (
              <motion.div
                key={idea._id}
                className="card-hover"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${iconColor} shrink-0`}>
                    <TypeIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-medium break-words">{idea.title}</h3>
                        {idea.description && (
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2 break-words">{idea.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleEdit(idea)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                          <Edit3 size={14} className="text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(idea._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 size={14} className="text-gray-500 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                        {idea.type}
                      </span>
                      {idea.tags?.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400">
                          #{tag}
                        </span>
                      ))}
                      <span className={`text-xs capitalize px-2 py-0.5 rounded-full ${
                        idea.status === "used" ? "bg-green-500/10 text-green-400" :
                        idea.status === "in_progress" ? "bg-blue-500/10 text-blue-400" :
                        idea.status === "archived" ? "bg-gray-500/10 text-gray-400" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {idea.status?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg card max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">{editing ? "Edit Idea" : "New Idea"}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/10 rounded-lg"><X size={18} /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Idea title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field h-24 resize-none" placeholder="Describe your idea..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                      <option value="video">Video</option>
                      <option value="script">Script</option>
                      <option value="hook">Hook</option>
                      <option value="transition">Transition</option>
                      <option value="concept">Concept</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                      <option value="draft">Draft</option>
                      <option value="in_progress">In Progress</option>
                      <option value="used">Used</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                  <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="glowup, transition, viral" />
                </div>
                <button onClick={handleSubmit} className="btn-primary w-full">
                  {editing ? "Update Idea" : "Save Idea"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
