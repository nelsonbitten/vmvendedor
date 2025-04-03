import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm shadow-lg rounded-2xl p-8 space-y-6 border border-gray-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Entre para continuar acessando sua conta
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="Digite seu email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        </div>

        <button className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition">
          Entrar
        </button>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="h-px w-16 bg-gray-300" />
          ou
          <span className="h-px w-16 bg-gray-300" />
        </div>

        <button className="w-full border border-gray-300 flex items-center justify-center gap-3 py-2.5 rounded-lg hover:bg-gray-100 transition text-sm">
          <FaGoogle className="text-red-500" />
          <span className="font-medium text-gray-700">Entrar com Google</span>
        </button>

        <p className="text-sm text-center text-gray-500">
          Não tem uma conta?{" "}
          <a href="#" className="text-gray-800 hover:underline font-medium">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}
