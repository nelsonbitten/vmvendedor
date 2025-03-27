import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();
  }, []);

  if (loading) return null;

  // Se não estiver logado, redireciona pro login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
