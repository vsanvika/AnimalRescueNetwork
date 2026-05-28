import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('arn_user') || 'null'),

  setUser: (user) => {
    localStorage.setItem('arn_user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('arn_user');
    set({ user: null });
  },

  updateUser: (data) => {
    set((state) => {
      const updated = { ...state.user, ...data };
      localStorage.setItem('arn_user', JSON.stringify(updated));
      return { user: updated };
    });
  },
}));

export default useAuthStore;
