import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthPage from "./AuthPage";
import CoursePage from "./CoursePage";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <i className="fas fa-spinner fa-spin text-3xl text-yellow-400" />
      </div>
    );
  }

  if (!user) return <AuthPage />;
  return <CoursePage />;
};

export default Index;
