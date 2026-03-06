import { useState, useEffect } from "react";
import { getAllPapers } from "../api/research";
import { getCurrentUser, logoutUser } from "../api/auth";
import { FileText, Users, LogOut } from "lucide-react"; // icons

export default function AdminDashboard() {
    const [papers, setPapers] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndPapers = async () => {
            try {
                const u = await getCurrentUser();
                setUser(u);

                const res = await getAllPapers();
                setPapers(res.papers);
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
            }
        };
        fetchUserAndPapers();
    }, []);

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
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded shadow">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                        <Users className="w-6 h-6 text-blue-500" />
                        <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 font-medium">{user.email}</span>
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

                {/* Papers Table */}
                <section className="bg-white p-4 sm:p-6 rounded shadow overflow-x-auto">
                    <div className="flex items-center space-x-2 mb-3">
                        <FileText className="w-5 h-5 text-green-500" />
                        <h2 className="text-lg font-semibold">All Uploaded Papers</h2>
                    </div>

                    <table className="min-w-full table-auto border-collapse text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border p-2">Paper ID</th>
                                <th className="border p-2">Uploaded By</th>
                                <th className="border p-2">File Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {papers.length > 0 ? (
                                papers.map((p, index) => (
                                    <tr
                                        key={p.paper_id || index}
                                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                    >
                                        <td className="border p-2">{p.paper_id}</td>
                                        <td className="border p-2">{p.uploaded_by}</td>
                                        <td className="border p-2">{p.file_name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="border p-2 text-center text-gray-500"
                                    >
                                        No papers uploaded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}