import { create } from 'zustand';

export const useStore = create((set) => ({
  name: "Name",
  field: "Field",
  about: "About",
  education: ["", ""],
  linkedin: "",
  github: "",
  email: "",
  phone: "",
  instagram: "",
  setInfo: (info) => set((state) => ({ ...state, ...info })),
}));
