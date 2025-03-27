import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email ou senha inválidos.");
    } else {
      console.log("Usuário autenticado:", data.user);
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-black text-white p-10">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold">
            Discover the Future of Finance <br /> from Mars ✴ to Your Wallet
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Vender Maquininha
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-black focus:border-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-black focus:border-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-gray-500 hover:text-black">
                  Esqueci minha senha
                </a>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-medium py-2 px-4 rounded-xl transition duration-200 hover:bg-gray-800"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
