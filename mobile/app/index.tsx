import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import LoadingSpinner from "../src/components/LoadingSpinner";

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? "/rooms" : "/login");
    }
  }, [loading, user]);

  return <LoadingSpinner />;
}