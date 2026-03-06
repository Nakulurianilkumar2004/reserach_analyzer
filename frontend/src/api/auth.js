import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // e.g., http://localhost:8000/api
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // for cookies/session auth
});

// Auth API
export const registerUser = async (email, password, role = "user") => {
    const res = await API.post("/auth/register", { email, password, role });
    return res.data;
};

export const loginUser = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res.data;
};

export const logoutUser = async () => {
    const res = await API.post("/auth/logout");
    return res.data;
};

export const getCurrentUser = async () => {
    const res = await API.get("/auth/user");
    return res.data;
};