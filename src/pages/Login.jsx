/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Enter the username");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Simulate async login (remove if login is synchronous)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login(username);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSearch = (query) => {
    console.log("Search:", query);
  };

  const handleFilter = (region) => {
    console.log("Filter:", region);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header onSearch={handleSearch} onFilter={handleFilter} />
      <main className="container mx-auto p-6 flex-grow flex items-center justify-center">
        <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded  max-w-md w-full transform transition-all duration-300 ">
          <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
            Login
          </h1>
          {user ? (
            <div className="text-center animate-fade-in">
              <p className="text-lg text-gray-600 mb-4">
                You are logged in as{" "}
                <span className="font-semibold text-black">
                  {user.username}
                </span>
                .
              </p>
              {/* <button
                onClick={() => navigate("/")}
                className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                aria-label="Go to home page"
              >
                Go to Home
              </button> */}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {error && (
                <p
                  className="text-center text-red-500 text-sm animate-slide-down"
                  aria-live="polite"
                >
                  {error}
                </p>
              )}
              <div>
                {/* <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label> */}
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blackfocus:border-transparent transition-all duration-200"
                  placeholder="Username here..."
                  aria-describedby={error ? "username-error" : undefined}
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-300 text-white p-3 rounded-lg font-medium hover:bg-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blackfocus:ring-offset-2 flex items-center justify-center disabled:bg-green-300 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                aria-label="Log in"
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
