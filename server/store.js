import bcrypt from "bcryptjs";

class MemoryStore {
  constructor() {
    this.users = [];
    this.captions = [];
    this.ideas = [];
    this.posts = [];
    this.trends = [];
    this.analytics = [];
    this.idCounter = 1;
  }

  newId() {
    return String(this.idCounter++);
  }

  async createUser({ email, password, name }) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = {
      _id: this.newId(),
      email,
      password: hashed,
      name: name || "",
      username: email.split("@")[0] + Math.floor(Math.random() * 1000),
      avatar: "",
      bio: "",
      plan: "free",
      linkinbio: { profilePic: "", bio: "", links: [], socialLinks: {}, theme: "dark" },
      preferences: { darkMode: true, emailNotifications: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const exists = this.users.find((u) => u.email === email);
    if (exists) throw new Error("User already exists");
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find((u) => u.email === email);
  }

  findUserById(id) {
    return this.users.find((u) => u._id === id);
  }

  updateUser(id, updates) {
    const idx = this.users.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    Object.assign(this.users[idx], updates, { updatedAt: new Date() });
    return this.users[idx];
  }

  createCaption(doc) {
    const caption = { ...doc, _id: this.newId(), createdAt: new Date(), updatedAt: new Date() };
    this.captions.push(caption);
    return caption;
  }

  findCaptionsByUser(userId) {
    return this.captions
      .filter((c) => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);
  }

  updateCaption(id, userId, updates) {
    const idx = this.captions.findIndex((c) => c._id === id && c.userId === userId);
    if (idx === -1) return null;
    Object.assign(this.captions[idx], updates);
    return this.captions[idx];
  }

  createIdea(doc) {
    const idea = { ...doc, _id: this.newId(), createdAt: new Date(), updatedAt: new Date() };
    this.ideas.push(idea);
    return idea;
  }

  findIdeasByUser(userId, query = {}) {
    let results = this.ideas.filter((i) => i.userId === userId);
    if (query.status) results = results.filter((i) => i.status === query.status);
    if (query.type) results = results.filter((i) => i.type === query.type);
    if (query.search) {
      const s = query.search.toLowerCase();
      results = results.filter(
        (i) =>
          i.title.toLowerCase().includes(s) ||
          (i.description || "").toLowerCase().includes(s) ||
          (i.tags || []).some((t) => t.toLowerCase().includes(s))
      );
    }
    return results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  updateIdea(id, userId, updates) {
    const idx = this.ideas.findIndex((i) => i._id === id && i.userId === userId);
    if (idx === -1) return null;
    Object.assign(this.ideas[idx], updates, { updatedAt: new Date() });
    return this.ideas[idx];
  }

  deleteIdea(id, userId) {
    const idx = this.ideas.findIndex((i) => i._id === id && i.userId === userId);
    if (idx === -1) return null;
    return this.ideas.splice(idx, 1)[0];
  }

  createPost(doc) {
    const post = { ...doc, _id: this.newId(), createdAt: new Date(), updatedAt: new Date() };
    this.posts.push(post);
    return post;
  }

  findPostsByUser(userId, query = {}) {
    let results = this.posts.filter((p) => p.userId === userId);
    if (query.month && query.year) {
      results = results.filter((p) => {
        const d = new Date(p.scheduledDate);
        return d.getMonth() + 1 === parseInt(query.month) && d.getFullYear() === parseInt(query.year);
      });
    }
    return results.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  }

  updatePost(id, userId, updates) {
    const idx = this.posts.findIndex((p) => p._id === id && p.userId === userId);
    if (idx === -1) return null;
    Object.assign(this.posts[idx], updates, { updatedAt: new Date() });
    return this.posts[idx];
  }

  deletePost(id, userId) {
    const idx = this.posts.findIndex((p) => p._id === id && p.userId === userId);
    if (idx === -1) return null;
    return this.posts.splice(idx, 1)[0];
  }

  createTrend(doc) {
    const trend = { ...doc, _id: this.newId(), createdAt: new Date(), updatedAt: new Date() };
    this.trends.push(trend);
    return trend;
  }

  findTrendsByUser(userId, query = {}) {
    let results = this.trends.filter((t) => t.userId === userId);
    if (query.category) results = results.filter((t) => t.category === query.category);
    if (query.used !== undefined) results = results.filter((t) => t.used === (query.used === "true"));
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  updateTrend(id, userId, updates) {
    const idx = this.trends.findIndex((t) => t._id === id && t.userId === userId);
    if (idx === -1) return null;
    Object.assign(this.trends[idx], updates);
    return this.trends[idx];
  }

  deleteTrend(id, userId) {
    const idx = this.trends.findIndex((t) => t._id === id && t.userId === userId);
    if (idx === -1) return null;
    return this.trends.splice(idx, 1)[0];
  }

  createAnalytics(doc) {
    const entry = { ...doc, _id: this.newId(), date: doc.date || new Date(), createdAt: new Date(), updatedAt: new Date() };
    this.analytics.push(entry);
    return entry;
  }

  findAnalyticsByUser(userId, days = 30) {
    const start = new Date();
    start.setDate(start.getDate() - parseInt(days));
    return this.analytics
      .filter((a) => a.userId === userId && new Date(a.date) >= start)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }
}

const store = new MemoryStore();
export default store;
