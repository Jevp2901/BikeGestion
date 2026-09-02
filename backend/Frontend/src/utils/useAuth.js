import { useEffect, useState } from "react";
import { obtenerSesion } from "./sesion";

export function useAuth() {
  const [user, setUser] = useState(() => obtenerSesion());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(obtenerSesion());
    setLoading(false);

    const handleStorage = () => {
      setUser(obtenerSesion());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
  };
}
