import { useState } from "react";
import { QuizQuestion } from "@/data/courseData";

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const QuizSection = ({ questions, onComplete }: QuizSectionProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const finalScore = selected === questions[currentQ].correctIndex ? score : score;
      setFinished(true);
      onComplete(finalScore);
    }
  };

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <i className={`fas ${percent >= 50 ? "fa-trophy text-primary" : "fa-redo text-accent"} text-3xl`} />
        </div>
        <h3 className="text-xl font-heading font-bold text-foreground">
          Результат: {score}/{questions.length}
        </h3>
        <p className="text-muted-foreground mt-1">
          {percent >= 50 ? "Отличная работа!" : "Попробуйте пересмотреть материал"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">
          Вопрос {currentQ + 1} из {questions.length}
        </span>
        <span className="text-sm font-semibold text-primary">
          <i className="fas fa-star mr-1" />
          {score} баллов
        </span>
      </div>

      <h3 className="text-lg font-heading font-bold text-foreground mb-4">
        {questions[currentQ].question}
      </h3>

      <div className="space-y-3">
        {questions[currentQ].options.map((opt, idx) => {
          let optClass = "border-border bg-card";
          if (answered) {
            if (idx === questions[currentQ].correctIndex) {
              optClass = "border-success bg-success/10";
            } else if (idx === selected) {
              optClass = "border-accent bg-accent/10";
            }
          } else if (idx === selected) {
            optClass = "border-primary bg-primary/10";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${optClass}`}
            >
              <span className="text-foreground">{opt}</span>
              {answered && idx === questions[currentQ].correctIndex && (
                <i className="fas fa-check text-success float-right mt-1" />
              )}
              {answered && idx === selected && idx !== questions[currentQ].correctIndex && (
                <i className="fas fa-times text-accent float-right mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <button
          onClick={handleNext}
          className="w-full mt-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          {currentQ < questions.length - 1 ? "Следующий вопрос" : "Завершить тест"}
        </button>
      )}
    </div>
  );
};

export default QuizSection;
