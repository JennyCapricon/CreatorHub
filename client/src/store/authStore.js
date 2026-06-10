import { create } from "zustand";
import { auth as authApi } from "../utils/api";

const loadUser = () => {
  try {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      return { token, user: JSON.parse(savedUser) };
    }
  } catch {}
  return { token: null, user: null };
};

const { token: storedToken, user: storedUser } = loadUser();

const useAuthStore = create((set) => ({
  user: storedUser,
  token: storedToken,
  loading: false,

  login: async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data;
  },

  register: async (email, password, name) => {
    const { data } = await authApi.register({ email, password, name });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  updateUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },

  setLoading: (loading) => set({ loading }),

  hydrate: () => {
    const { token, user } = loadUser();
    set({ user, token, loading: false });
  },
}));

export default useAuthStore;
