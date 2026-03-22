import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AuthPage = ({ onAuth }: { onAuth: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md md:max-w-xl">
        {/* Лого над карточкой */}
        <div className="flex justify-center mb-5">
          <img
            src="/newlogo.svg"
            alt="HAPPI10 logo"
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
          />
        </div>

        <div className="bg-card rounded-2xl p-4 md:p-7 shadow-sm border border-border">
          {/* Баннер внутри карточки */}
          <div className="relative overflow-hidden rounded-2xl mb-6 h-48 md:h-56">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/new1.png')",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-black/45" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                <span className="text-white">HAPPI</span>
                <span className="text-yellow-400">10</span>
              </h1>

              <p className="mt-3 text-white/90 text-base md:text-lg font-medium">
                Архитектура счастья
              </p>
            </div>
          </div>

          {/* Переключатель */}
          <div className="flex mb-6 bg-muted rounded-xl p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg text-sm md:text-base font-semibold transition-colors ${
                isLogin
                  ? "bg-yellow-400 text-black"
                  : "text-muted-foreground"
              }`}
            >
              Вход
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg text-sm md:text-base font-semibold transition-colors ${
                !isLogin
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground"
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  <i className="fas fa-user mr-2 text-black" />
                  Имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 md:py-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Ваше имя"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <i className="fas fa-envelope mr-2 text-black" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 md:py-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                <i className="fas fa-lock mr-2 text-black" />
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 md:py-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 md:py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90 ${
                isLogin
                  ? "bg-yellow-400 text-black"
                  : "bg-orange-500 text-white"
              }`}
            >
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;