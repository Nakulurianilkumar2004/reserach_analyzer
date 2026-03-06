import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:8000/api
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// ---------------------------
// User APIs
// ---------------------------

// Upload PDF paper
export const uploadPaper = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await API.post("/research/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// Ask question about a paper
export const askQuestion = async (paper_id, question) => {
    const res = await API.post("/research/ask", { paper_id, question });
    return res.data;
};

// ---------------------------
// Admin APIs
// ---------------------------
export const getAllPapers = async () => {
    const res = await API.get("/research/admin/papers");
    return res.data;
};