"use client";

import React, { useMemo, useState } from "react";
import { Card } from "../../components/Card";

type Question = {
  question: string;
  options: string[];
  correct: number;
};

type Lesson = {
  id: string;
  title: string;
  minutes: number;
  description: string;
  keyPoints: string[];
  questions: Question[];
};

const lessons: Lesson[] = [
  {
    id: "l1",
    title: "What is an Emergency Fund?",
    minutes: 3,
    description:
      "Learn why emergency savings are important and how much you should ideally keep.",
    keyPoints: [
      "Aim for 3–6 months of essential expenses",
      "Keep emergency money liquid",
      "Start small and build gradually",
    ],
    questions: [
      {
        question: "What is the main purpose of an emergency fund?",
        options: [
          "Buying luxury products",
          "Handling unexpected expenses",
          "Investing in risky stocks",
          "Paying entertainment expenses",
        ],
        correct: 1,
      },
      {
        question: "How much emergency savings is commonly recommended?",
        options: [
          "1 week of expenses",
          "3–6 months of expenses",
          "10 years of expenses",
          "Only ₹1,000",
        ],
        correct: 1,
      },
      {
        question: "Where should emergency money generally be kept?",
        options: [
          "Highly risky investments",
          "An easily accessible place",
          "Only in cryptocurrency",
          "Locked for 15 years",
        ],
        correct: 1,
      },
    ],
  },

  {
    id: "l2",
    title: "Budgeting Basics",
    minutes: 4,
    description:
      "Understand how to control spending and divide income between needs, wants and savings.",
    keyPoints: [
      "Track your income and expenses",
      "Set category-wise spending limits",
      "Use budgeting rules such as 50/30/20",
    ],
    questions: [
      {
        question: "What should you do first while making a budget?",
        options: [
          "Ignore expenses",
          "Track income and expenses",
          "Take a loan",
          "Stop saving",
        ],
        correct: 1,
      },
      {
        question: "In the 50/30/20 rule, 20% is generally meant for:",
        options: [
          "Savings and debt repayment",
          "Entertainment",
          "Rent only",
          "Shopping",
        ],
        correct: 0,
      },
      {
        question: "Why are category limits useful?",
        options: [
          "They increase unnecessary spending",
          "They help control spending",
          "They remove income",
          "They guarantee profits",
        ],
        correct: 1,
      },
    ],
  },

  {
    id: "l3",
    title: "SIP Basics",
    minutes: 4,
    description:
      "Learn the basic idea behind systematic investing and long-term wealth creation.",
    keyPoints: [
      "Invest a fixed amount regularly",
      "Benefit from rupee-cost averaging",
      "Long-term consistency matters",
    ],
    questions: [
      {
        question: "What does SIP stand for?",
        options: [
          "Systematic Investment Plan",
          "Simple Income Process",
          "Savings Insurance Program",
          "Stock Investment Policy",
        ],
        correct: 0,
      },
      {
        question: "A SIP usually means:",
        options: [
          "Investing regularly",
          "Investing only once",
          "Never saving money",
          "Borrowing money every month",
        ],
        correct: 0,
      },
      {
        question: "One advantage of regular investing is:",
        options: [
          "Rupee-cost averaging",
          "Guaranteed unlimited returns",
          "Zero market risk",
          "Instant wealth",
        ],
        correct: 0,
      },
    ],
  },

  {
    id: "l4",
    title: "Needs vs Wants",
    minutes: 3,
    description:
      "Learn how separating needs and wants can improve your monthly savings.",
    keyPoints: [
      "Needs are essential expenses",
      "Wants are optional lifestyle expenses",
      "Reducing wants can improve savings",
    ],
    questions: [
      {
        question: "Which of these is usually a need?",
        options: ["Rent", "Gaming console", "Luxury shoes", "Movie subscription"],
        correct: 0,
      },
      {
        question: "Which is normally considered a want?",
        options: ["Basic food", "Electricity", "Luxury headphones", "Medicine"],
        correct: 2,
      },
      {
        question: "Reducing unnecessary wants can help you:",
        options: [
          "Save more money",
          "Lose all income",
          "Increase debt automatically",
          "Stop budgeting",
        ],
        correct: 0,
      },
    ],
  },
];

type QuizResult = {
  score: number;
  total: number;
};

export default function LearnPage() {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<Record<string, QuizResult>>({});
  const [submitted, setSubmitted] = useState(false);

  const completedCount = Object.keys(results).length;

  const totalCorrect = useMemo(() => {
    return Object.values(results).reduce((sum, result) => sum + result.score, 0);
  }, [results]);

  const totalQuestions = useMemo(() => {
    return Object.values(results).reduce((sum, result) => sum + result.total, 0);
  }, [results]);

  const accuracy =
    totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;

  const startQuiz = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setAnswers({});
    setSubmitted(false);
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const submitQuiz = () => {
    if (!activeLesson) return;

    let score = 0;

    activeLesson.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        score += 1;
      }
    });

    setResults((prev) => ({
      ...prev,
      [activeLesson.id]: {
        score,
        total: activeLesson.questions.length,
      },
    }));

    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Learn Finance</h2>
        <p className="text-sm text-gray-500 mt-1">
          Learn important finance concepts and test yourself with mini quizzes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Lessons Completed">
          <div className="text-3xl font-bold text-primary">
            {completedCount}/{lessons.length}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Complete quizzes to increase progress.
          </div>
        </Card>

        <Card title="Quiz Accuracy">
          <div className="text-3xl font-bold text-green-600">
            {accuracy}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Based on completed quizzes.
          </div>
        </Card>

        <Card title="Correct Answers">
          <div className="text-3xl font-bold">
            {totalCorrect}/{totalQuestions || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Your overall quiz performance.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lessons.map((lesson) => {
          const result = results[lesson.id];

          return (
            <Card
              key={lesson.id}
              title={lesson.title}
              subtitle={`${lesson.minutes} min lesson`}
            >
              <p className="text-sm text-gray-600 mb-3">
                {lesson.description}
              </p>

              <ul className="list-disc pl-5 text-sm space-y-1">
                {lesson.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>

              {result && (
                <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3">
                  <div className="text-sm font-semibold text-green-700">
                    Quiz completed
                  </div>

                  <div className="text-sm text-green-700 mt-1">
                    Score: {result.score}/{result.total} (
                    {Math.round((result.score / result.total) * 100)}%)
                  </div>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => startQuiz(lesson)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
                >
                  {result ? "Retake Quiz" : "Take Quiz"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {activeLesson && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xl font-semibold">
                  {activeLesson.title}
                </h3>

                <p className="text-sm text-gray-500">
                  Answer all questions and submit your quiz.
                </p>
              </div>

              <button
                onClick={() => setActiveLesson(null)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {activeLesson.questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                  <div className="font-medium mb-3">
                    {questionIndex + 1}. {question.question}
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const selected =
                        answers[questionIndex] === optionIndex;

                      const correct =
                        submitted &&
                        optionIndex === question.correct;

                      const wrong =
                        submitted &&
                        selected &&
                        optionIndex !== question.correct;

                      let extraClass =
                        "border-gray-200 hover:border-primary";

                      if (selected && !submitted) {
                        extraClass =
                          "border-primary bg-blue-50";
                      }

                      if (correct) {
                        extraClass =
                          "border-green-500 bg-green-50";
                      }

                      if (wrong) {
                        extraClass =
                          "border-red-500 bg-red-50";
                      }

                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() =>
                            selectAnswer(
                              questionIndex,
                              optionIndex
                            )
                          }
                          className={`w-full text-left border rounded-lg px-4 py-3 ${extraClass}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {submitted && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-semibold text-blue-800">
                  Your Score
                </div>

                <div className="text-2xl font-bold text-blue-700 mt-1">
                  {results[activeLesson.id]?.score}/
                  {activeLesson.questions.length}
                </div>

                <div className="text-sm text-blue-700 mt-1">
                  {Math.round(
                    ((results[activeLesson.id]?.score || 0) /
                      activeLesson.questions.length) *
                      100
                  )}
                  %
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setActiveLesson(null)}
                className="border px-4 py-2 rounded-lg"
              >
                Close
              </button>

              {!submitted && (
                <button
                  onClick={submitQuiz}
                  className="bg-primary text-white px-4 py-2 rounded-lg"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}