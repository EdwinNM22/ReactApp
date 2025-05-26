import { create } from 'zustand';

const useRoleStore = create((set) => ({
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),
}));

export default useRoleStore;