import { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { courseElements } from "@/data/courseData";
import QuizSection from "@/components/QuizSection";
import HomeworkSection from "@/components/HomeworkSection";
import { useAuth } from "@/context/AuthContext";
import { logoutUser, loadUserProgress, saveUserProgress, UserProgress } from "@/lib/firebase";

type ElementState = {
  expanded: boolean;
  step: "video" | "quiz" | "homework" | "completed";
  quizScore: number | null;
};

const TOTAL = courseElements.length;

const defaultStates = (): ElementState[] =>
  courseElements.map((_, i) => ({ expanded: i === 0, step: "video", quizScore: null }));

const CoursePage = () => {
  const { user } = useAuth();
  const [unlockedUpTo, setUnlockedUpTo] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [elementStates, setElementStates] = useState<ElementState[]>(defaultStates());
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadUserProgress(user.uid, TOTAL).then((prog) => {
      setUnlockedUpTo(prog.unlockedUpTo);
      const merged = courseElements.map((_, i) => prog.elementStates[i] ?? defaultStates()[i]);
      setElementStates(merged);
      setProgressLoaded(true);
    });
  }, [user]);

  const persistProgress = useCallback(
    (unlocked: number, states: ElementState[]) => {
      if (!user || !progressLoaded) return;
      const prog: UserProgress = { unlockedUpTo: unlocked, elementStates: states };
      saveUserProgress(user.uid, prog).catch(console.error);
    },
    [user, progressLoaded],
  );

  const updateElement = (idx: number, updates: Partial<ElementState>) => {
    setElementStates((prev) => {
      const next = prev.map((s, i) => (i === idx ? { ...s, ...updates } : s));
      persistProgress(unlockedUpTo, next);
      return next;
    });
  };

  const toggleExpand = (idx: number) => {
    if (idx > unlockedUpTo) return;
    updateElement(idx, { expanded: !elementStates[idx].expanded });
  };

  const handleQuizComplete = (idx: number, score: number) => {
    updateElement(idx, { quizScore: score, step: "homework" });
  };

  const handleHomeworkDone = (idx: number) => {
    const newUnlocked = idx >= unlockedUpTo ? idx + 1 : unlockedUpTo;
    const nextStates = elementStates.map((s, i) => {
      if (i === idx) return { ...s, step: "completed" as const };
      if (i === idx + 1 && idx >= unlockedUpTo) return { ...s, expanded: true };
      return s;
    });
    setUnlockedUpTo(newUnlocked);
    setElementStates(nextStates);
    persistProgress(newUnlocked, nextStates);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img src="/newlogo.svg" alt="HAPPI10 logo" className="h-10 w-auto shrink-0 object-contain" />
              <a
                href="https://www.happi10.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Вернуться на сайт
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user && (
                <span className="text-sm text-muted-foreground font-medium truncate max-w-[180px]">
                  <i className="fas fa-user-circle mr-1" />
                  {user.displayName || user.email}
                </span>
              )}
              <span className="text-sm text-muted-foreground font-medium">
                {Math.min(unlockedUpTo, TOTAL)}/{TOTAL} пройдено
              </span>
              <a
                href="https://t.me/+yoqsWMwnRNQwZmU6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold bg-yellow-400 text-black hover:opacity-90 transition-opacity"
              >
                <i className="fab fa-telegram-plane" />
                Возник вопрос?
              </a>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Выйти"
              >
                <i className="fas fa-sign-out-alt" />
              </button>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                {Math.min(unlockedUpTo, TOTAL)}/{TOTAL}
              </span>
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
              >
                <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"}`} />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-3 border-t border-border pt-3 space-y-2">
              {user && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  <i className="fas fa-user-circle mr-2" />
                  {user.displayName || user.email}
                </div>
              )}
              <a
                href="https://www.happi10.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Вернуться на сайт
              </a>
              <a
                href="https://t.me/yourtelegram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold bg-yellow-400 text-black hover:opacity-90 transition-opacity"
              >
                <i className="fab fa-telegram-plane" />
                Возник вопрос?
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <i className="fas fa-sign-out-alt" />
                Выйти
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="bg-muted h-1">
        <div
          className="bg-primary h-full transition-all duration-500"
          style={{ width: `${(unlockedUpTo / TOTAL) * 100}%` }}
        />
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3 pb-20">
        {courseElements.map((el, idx) => {
          const isLocked = idx > unlockedUpTo;
          const isCompleted = idx < unlockedUpTo;
          const state = elementStates[idx];

          return (
            <div
              key={el.id}
              className={`rounded-xl border transition-colors ${isLocked ? "border-border/50 bg-muted/30 opacity-60" : isCompleted ? "border-success/30 bg-card" : "border-border bg-card"}`}
            >
              <button
                onClick={() => toggleExpand(idx)}
                disabled={isLocked}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isCompleted ? "bg-success/10 text-success" : isLocked ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}
                >
                  {isCompleted ? (
                    <i className="fas fa-check" />
                  ) : isLocked ? (
                    <i className="fas fa-lock text-xs" />
                  ) : (
                    el.id
                  )}
                </div>
                <span
                  className={`flex-1 font-semibold text-sm ${isLocked ? "text-muted-foreground" : "text-foreground"}`}
                >
                  {el.title}
                </span>
                {!isLocked && (
                  <i className={`fas fa-chevron-${state.expanded ? "up" : "down"} text-muted-foreground text-xs`} />
                )}
                {isLocked && <i className="fas fa-lock text-muted-foreground text-xs" />}
              </button>

              {state.expanded && !isLocked && (
                <div className="px-4 pb-4 space-y-5">
                  <div className="aspect-video rounded-lg overflow-hidden bg-foreground/5">
                    <iframe
                      src={`https://www.youtube.com/embed/${el.videoId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={el.title}
                    />
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{el.description}</p>

                  {state.step === "video" && (
                    <button
                      onClick={() => updateElement(idx, { step: "quiz" })}
                      className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity text-sm"
                    >
                      <i className="fas fa-play-circle mr-2" />
                      Перейти к тесту
                    </button>
                  )}

                  {state.step === "quiz" && (
                    <div className="bg-background rounded-lg border border-border p-4">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        <i className="fas fa-question-circle mr-2 text-primary" />
                        Тест
                      </h3>
                      <QuizSection questions={el.quiz} onComplete={(score) => handleQuizComplete(idx, score)} />
                    </div>
                  )}

                  {state.step === "homework" && (
                    <div className="space-y-4">
                      {state.quizScore !== null && (
                        <div className="p-3 rounded-lg bg-primary/10 text-sm">
                          <i className="fas fa-star text-primary mr-2" />
                          Результат теста:{" "}
                          <strong>
                            {state.quizScore}/{el.quiz.length}
                          </strong>
                        </div>
                      )}
                      <div className="bg-background rounded-lg border border-border p-4">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          <i className="fas fa-pencil-alt mr-2 text-primary" />
                          Домашнее задание
                        </h3>
                        <HomeworkSection
                          text={el.homework}
                          fileUrl={el.homeworkFileUrl}
                          fileName={el.homeworkFileName}
                        />
                      </div>
                      <button
                        onClick={() => handleHomeworkDone(idx)}
                        className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition-opacity text-sm"
                      >
                        <i className="fas fa-check mr-2" />
                        Завершить элемент
                      </button>
                    </div>
                  )}

                  {state.step === "completed" && (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-check-circle text-success text-xl" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Элемент пройден!</p>
                      {state.quizScore !== null && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Тест: {state.quizScore}/{el.quiz.length}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {unlockedUpTo >= TOTAL && (
          <div className="rounded-xl border border-secondary bg-card p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-crown text-secondary text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Поздравляем!</h3>
            <p className="text-muted-foreground text-sm mt-1">Курс полностью пройден</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
