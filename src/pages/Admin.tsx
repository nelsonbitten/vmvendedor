import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-auth") === "true";
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Painel de Administração</h1>
      {/* Seu conteúdo do admin aqui */}
    </div>
  );
}
