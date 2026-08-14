import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, ChevronLeft, ChevronRight, Plus, Trash2, Edit3, X,
} from "lucide-react";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays,
  addMonths, subMonths, isSameMonth, isSameDay, isToday,
} from "date-fns";
import { posts as postsApi } from "../utils/api";

export default function CalendarPlanner() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({ title: "", caption: "", platform: "tiktok", tags: "" });

  useEffect(() => {
    loadPosts();
  }, [currentMonth]);

  const loadPosts = async () => {
    try {
      const { data } = await postsApi.getAll({
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
      });
      setPosts(data.posts || []);
    } catch {
      /* offline fallback */
    }
  };

  const getPostsForDate = (date) =>
    posts.filter((p) => isSameDay(new Date(p.scheduledDate), date));

  const handlePrevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  const openModal = (date, post = null) => {
    setSelectedDate(date);
    setEditingPost(post);
    setForm(
      post
        ? { title: post.title, caption: post.caption, platform: post.platform, tags: post.tags?.join(", ") || "" }
        : { title: "", caption: "", platform: "tiktok", tags: "" }
    );
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !selectedDate) return;
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        scheduledDate: selectedDate,
      };

      if (editingPost) {
        await postsApi.update(editingPost._id, payload);
      } else {
        await postsApi.create(payload);
      }
      await loadPosts();
      setShowModal(false);
    } catch {
      /* handle offline */
    }
  };

  const handleDelete = async (id) => {
    try {
      await postsApi.delete(id);
      await loadPosts();
      setShowModal(false);
    } catch {
      /* handle offline */
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const datePosts = getPostsForDate(day);
        days.push(
          <button
            key={day.toISOString()}
            onClick={() => openModal(day)}
            className={`
              relative p-1.5 sm:p-2 h-20 sm:h-24 text-left transition-all duration-200 rounded-xl border min-w-0
              ${!isSameMonth(day, monthStart) ? "opacity-30" : ""}
              ${isToday(day) ? "border-brand-500/50 bg-brand-500/5" : "border-transparent hover:bg-white/5"}
            `}
          >
            <span
              className={`text-xs sm:text-sm ${
                isToday(day) ? "text-brand-400 font-bold" : "text-gray-400"
              }`}
            >
              {format(day, "d")}
            </span>
            <div className="mt-1 space-y-1">
              {datePosts.slice(0, 2).map((post) => (
                <div
                  key={post._id}
                  onClick={(e) => { e.stopPropagation(); openModal(day, post); }}
                  className={`text-xs px-1.5 py-0.5 rounded truncate ${
                    post.status === "posted"
                      ? "bg-green-500/20 text-green-400"
                      : post.status === "draft"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {post.title || "Untitled"}
                </div>
              ))}
              {datePosts.length > 2 && (
                <span className="text-xs text-gray-500">+{datePosts.length - 2} more</span>
              )}
            </div>
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toISOString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Content Planner</h1>
            <p className="text-sm text-gray-400">Schedule and manage your content calendar</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-xl transition-colors shrink-0" aria-label="Previous month">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold whitespace-nowrap">{format(currentMonth, "MMMM yyyy")}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-xl transition-colors shrink-0" aria-label="Next month">
              <ChevronRight size={20} />
            </button>
          </div>
          <button
            onClick={() => openModal(new Date())}
            className="btn-primary text-sm !py-2 !px-4 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Post
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((name) => (
            <div key={name} className="text-center text-[11px] sm:text-xs text-gray-500 font-medium py-2">
              {name}
            </div>
          ))}
        </div>

        <div className="space-y-1">{renderCalendar()}</div>
      </motion.div>

      <AnimatePresence>
        {showModal && selectedDate && (
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
              className="w-full max-w-md card max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {editingPost ? "Edit Post" : "New Post"}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <div className="text-sm text-gray-400 mb-4">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input-field"
                    placeholder="Post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Caption</label>
                  <textarea
                    value={form.caption}
                    onChange={(e) => setForm({ ...form, caption: e.target.value })}
                    className="input-field h-24 resize-none"
                    placeholder="Post caption..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="input-field"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="input-field"
                    placeholder="glowup, grwm, fashion"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={handleSave} className="btn-primary flex-1">
                    {editingPost ? "Update" : "Save"}
                  </button>
                  {editingPost && (
                    <button onClick={() => handleDelete(editingPost._id)} className="btn-secondary !text-red-400 hover:!bg-red-500/10">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
