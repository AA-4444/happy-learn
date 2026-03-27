import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { loginUser, registerUser, resetPassword } from "@/lib/firebase";

type Mode = "login" | "register" | "forgot";

const AuthPage = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const clearMessages = () => {
    setError("");
    setInfo("");
  };
  const switchMode = (m: Mode) => {
    setMode(m);
    clearMessages();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      if (mode === "login") {
        await loginUser(email, password);
      } else if (mode === "register") {
        if (!name.trim()) {
          setError("Введите имя");
          setLoading(false);
          return;
        }
        await registerUser(email, password, name.trim());
      } else {
        await resetPassword(email);
        setInfo("Письмо для восстановления пароля отправлено на " + email);
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      setError(firebaseMessageRu(firebaseError.code ?? ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md md:max-w-xl">
        <div className="flex justify-center mb-5">
          <img src="/newlogo.svg" alt="HAPPI10 logo" className="w-20 h-20 md:w-24 md:h-24 object-contain" />
        </div>

        <div className="bg-card rounded-2xl p-4 md:p-7 shadow-sm border border-border">
          <div className="relative overflow-hidden rounded-2xl mb-6 h-48 md:h-56">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/new1.png')" }} />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-black/45" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                <span className="text-white">HAPPI</span>
                <span className="text-yellow-400">10</span>
              </h1>
              <p className="mt-3 text-white/90 text-base md:text-lg font-medium">Архитектура счастья</p>
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="flex mb-6 bg-muted rounded-xl p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 py-3 rounded-lg text-sm md:text-base font-semibold transition-colors ${mode === "login" ? "bg-yellow-400 text-black" : "text-muted-foreground"}`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 py-3 rounded-lg text-sm md:text-base font-semibold transition-colors ${mode === "register" ? "bg-orange-500 text-white" : "text-muted-foreground"}`}
              >
                Регистрация
              </button>
            </div>
          )}

          {mode === "forgot" && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
              >
                <i className="fas fa-arrow-left" /> Вернуться
              </button>
              <h2 className="text-lg font-bold text-foreground">Восстановление пароля</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Введите email — мы отправим ссылку для сброса пароля.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  <i className="fas fa-user mr-2 text-orange-500" />
                  Имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 md:py-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Ваше имя"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <i className="fas fa-envelope mr-2 text-yellow-500" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 md:py-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="your@email.com"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  <i className="fas fa-lock mr-2 text-yellow-500" />
                  Пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 md:py-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Забыли пароль?
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <i className="fas fa-exclamation-circle shrink-0" />
                {error}
              </div>
            )}
            {info && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                <i className="fas fa-check-circle shrink-0" />
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 md:py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${mode === "register" ? "bg-orange-500 text-white" : "bg-yellow-400 text-black"}`}
            >
              {loading && <i className="fas fa-spinner fa-spin" />}
              {mode === "login" && "Войти"}
              {mode === "register" && "Зарегистрироваться"}
              {mode === "forgot" && "Отправить письмо"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

function firebaseMessageRu(code: string): string {
  const map: Record<string, string> = {
    "auth/user-not-found": "Пользователь с таким email не найден.",
    "auth/wrong-password": "Неверный пароль.",
    "auth/invalid-credential": "Неверный email или пароль.",
    "auth/email-already-in-use": "Этот email уже занят.",
    "auth/weak-password": "Пароль слишком простой (минимум 6 символов).",
    "auth/invalid-email": "Некорректный формат email.",
    "auth/too-many-requests": "Слишком много попыток. Попробуйте позже.",
    "auth/network-request-failed": "Ошибка сети. Проверьте соединение.",
  };
  return map[code] ?? "Произошла ошибка. Попробуйте ещё раз.";
}

export default AuthPage;
