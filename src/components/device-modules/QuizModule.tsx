import { useState } from 'react';
import { FileQuestion, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import type { Device } from '../../data/types';

export function QuizModule({ device, onComplete }: { device: Device; onComplete: () => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(device.mcqs.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  const questions = device.mcqs;
  const score = answers.reduce<number>((acc, ans, i) => ans === questions[i].correctIndex ? acc + 1 : acc, 0);
  const percentage = Math.round((score / questions.length) * 100);

  const handleAnswer = (qIndex: number, optIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete();
  };

  const handleReset = () => {
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
    setCurrentQ(0);
  };

  const allAnswered = answers.every((a) => a !== null);

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${percentage >= 70 ? 'bg-green-100' : 'bg-amber-100'}`}>
            <Trophy className={`w-10 h-10 ${percentage >= 70 ? 'text-green-600' : 'text-amber-600'}`} />
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Quiz Complete!</h2>
          <p className="text-slate-600 mb-1">You scored</p>
          <div className="font-display text-5xl font-bold gradient-text mb-1">{percentage}%</div>
          <p className="text-slate-600">{score} out of {questions.length} correct</p>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => {
            const correct = answers[i] === q.correctIndex;
            return (
              <div key={i} className={`rounded-xl p-4 border-2 ${correct ? 'border-green-200 bg-green-50/50' : 'border-rose-200 bg-rose-50/50'}`}>
                <div className="flex items-start gap-3 mb-2">
                  {correct ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm mb-2">{q.question}</p>
                    <div className="space-y-1">
                      {q.options.map((opt, j) => (
                        <div key={j} className={`text-sm px-3 py-1.5 rounded-lg ${
                          j === q.correctIndex ? 'bg-green-100 text-green-700 font-medium' :
                          j === answers[i] ? 'bg-rose-100 text-rose-700' : 'text-slate-600'
                        }`}>
                          {opt}
                          {j === q.correctIndex && ' ✓'}
                          {j === answers[i] && j !== q.correctIndex && ' ✗'}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 bg-white rounded-lg p-3 border border-slate-100">
                      <p className="text-xs text-slate-500 font-semibold mb-1">Explanation</p>
                      <p className="text-sm text-slate-700">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={handleReset} className="flex items-center gap-2 mx-auto text-sm font-medium text-primary-600 hover:text-primary-700">
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
          <FileQuestion className="w-5 h-5 text-rose-600" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">MCQ Quiz</h2>
      </div>

      <p className="text-slate-600">Test your knowledge of the {device.name}. Answer all {questions.length} questions to see your score.</p>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
              answers[i] !== null ? 'bg-teal-500 text-white' : i === currentQ ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
        <div className="text-xs text-primary-500 font-medium mb-2">Question {currentQ + 1} of {questions.length}</div>
        <p className="font-display text-lg font-semibold text-slate-900 mb-4">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, j) => (
            <button
              key={j}
              onClick={() => handleAnswer(currentQ, j)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                answers[currentQ] === j ? 'border-primary-400 bg-primary-50' : 'border-slate-200 bg-white hover:border-primary-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  answers[currentQ] === j ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + j)}
                </div>
                <span className="text-sm text-slate-700">{opt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-primary-600 transition-colors"
        >
          ← Previous
        </button>
        {currentQ < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="btn-primary text-sm py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
