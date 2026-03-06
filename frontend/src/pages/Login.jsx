import { useState } from "react";
import { loginUser, getCurrentUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, LogIn } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await loginUser(email, password);

            const user = await getCurrentUser();
            if (!user) {
                setError("Failed to fetch user info");
                setLoading(false);
                return;
            }

            if (user.role === "admin") navigate("/dashboard/admin");
            else navigate("/dashboard/user");

            setEmail("");
            setPassword("");
        } catch (err) {
            setError(err.response?.data?.detail || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <form className="bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg space-y-4" onSubmit={handleLogin}>

                {/* Title */}
                <div className="flex items-center space-x-2">
                    <User className="w-6 h-6 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Login</h2>
                </div>

                {/* Error message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Email input */}
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                </div>

                {/* Password input */}
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                </div>

                {/* Login button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400`}
                >
                    {loading ? "Logging in..." : "Login"} <LogIn className="w-5 h-5" />
                </button>

                {/* Link to Register */}
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/"
                        className="text-green-500 font-semibold hover:underline flex items-center justify-center space-x-1"
                    >
                        <span>Register</span>
                        <User className="w-4 h-4" />
                    </Link>
                </p>
            </form>
        </div>
    );
}