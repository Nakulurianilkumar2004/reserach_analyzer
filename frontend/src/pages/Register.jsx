import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, LogIn } from "lucide-react"; // icons

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Always register as "user"
            await registerUser(email, password, "user");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <form
                onSubmit={handleRegister}
                className="bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg space-y-4"
            >
                {/* Title */}
                <div className="flex items-center space-x-2">
                    <User className="w-6 h-6 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Register</h2>
                </div>

                {/* Error */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Email */}
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

                {/* Password */}
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

                {/* Register Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center space-x-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400`}
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                {/* Already have account */}
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-500 font-semibold hover:underline flex items-center justify-center space-x-1"
                    >
                        <span>Login</span> <LogIn className="w-4 h-4" />
                    </Link>
                </p>
            </form>
        </div>
    );
}