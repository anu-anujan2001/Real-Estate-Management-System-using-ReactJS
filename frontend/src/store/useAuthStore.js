import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast'


const useAuthStore = create((set) => ({
    authUser: null,
    isLoggingIn: false,
    // isSigningUp: false,
    // isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser: res.data });
        } catch (err) {
            console.log(err);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    //login
    login: async (userData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", userData);
            set({ authUser: res.data });
            toast.success("Login successful");
        } catch (err) {
            console.log(err);
            toast.error("Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },
}));

export default useAuthStore;
    