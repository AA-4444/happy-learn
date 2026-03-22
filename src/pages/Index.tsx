import { useState } from "react";
import AuthPage from "./AuthPage";
import CoursePage from "./CoursePage";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthPage onAuth={() => setIsAuthenticated(true)} />;
  }

  return <CoursePage onLogout={() => setIsAuthenticated(false)} />;
};

export default Index;
