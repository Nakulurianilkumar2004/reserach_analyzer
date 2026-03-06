import { useState, useEffect } from "react";
import { uploadPaper, askQuestion } from "../api/research";
import { getCurrentUser, logoutUser } from "../api/auth";
import { FileText, UploadCloud, MessageSquare, LogOut } from "lucide-react";

export default function UserDashboard() {
    const [file, setFile] = useState(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingAsk, setLoadingAsk] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const u = await getCurrentUser();
                setUser(u);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUser();
    }, []);

    const handleUpload = async () => {
        if (!file) return setMessage("Please select a file.");
        setLoadingUpload(true);
        setMessage("");
        try {
            const res = await uploadPaper(file);
            setMessage(`✅ Uploaded: ${res.file_name}`);
            setFile(null);
        } catch (err) {
            setMessage("❌ Upload failed.");
            console.error(err);
        } finally {
            setLoadingUpload(false);
        }
    };

    const handleAsk = async () => {
        if (!question) return setAnswer("❗ Enter a question first.");
        setLoadingAsk(true);
        setAnswer("");
        try {
            const paper_id = "last_uploaded_paper_id"; // replace with actual logic
            const res = await askQuestion(paper_id, question);
            setAnswer(res.answer);
        } catch (err) {
            setAnswer("❌ Failed to get answer.");
            console.error(err);
        } finally {
            setLoadingAsk(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-4 rounded shadow space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                        <FileText className="w-6 h-6 text-blue-500" />
                        <h1 className="text-xl font-bold">User Dashboard</h1>
                    </div>
                    {user && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                            <span className="text-gray-700 font-medium truncate max-w-xs">{user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 text-red-500 hover:text-red-700 font-semibold"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </header>

                {/* Upload Section */}
                <section className="bg-white p-4 sm:p-6 rounded shadow space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                        <UploadCloud className="w-5 h-5 text-green-500" />
                        <h2 className="text-lg font-semibold">Upload Research Paper</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="border p-2 rounded flex-1 w-full sm:w-auto"
                        />
                        <button
                            onClick={handleUpload}
                            disabled={loadingUpload}
                            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400`}
                        >
                            {loadingUpload ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    {message && <p className="text-sm text-gray-700 mt-1">{message}</p>}
                </section>

                {/* Ask Section */}
                <section className="bg-white p-4 sm:p-6 rounded shadow space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold">Ask a Question</h2>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter your question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={handleAsk}
                        disabled={loadingAsk}
                        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400`}
                    >
                        {loadingAsk ? "Asking..." : "Ask"}
                    </button>
                    {answer && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-gray-800 break-words">
                            <strong>Answer:</strong> {answer}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}