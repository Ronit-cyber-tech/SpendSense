"use client";

import React, { useMemo, useState } from "react";
import { useFinance } from "../../context/FinanceProvider";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AssistantPage() {
  const { state } = useFinance();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m your FinWise assistant. Ask me about your spending, income, budget, savings, SIPs, emergency funds, financial planning, or general personal finance.",
    },
  ]);

  const totalIncome = useMemo(
    () =>
      state.incomes.reduce(
        (sum, income) => sum + income.amount,
        0
      ),
    [state.incomes]
  );

  const totalExpenses = useMemo(
    () =>
      state.expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ),
    [state.expenses]
  );

  const availableBalance = totalIncome - totalExpenses;

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    state.expenses.forEach((expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + expense.amount;
    });

    return totals;
  }, [state.expenses]);

  const topCategory = useMemo(() => {
    return Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];
  }, [categoryTotals]);

  const getAssistantAnswer = (input: string) => {
    const q = input.toLowerCase().trim();

    if (!q) {
      return "Please type a question.";
    }

    if (
      q.includes("total income") ||
      q.includes("my income")
    ) {
      return `Your total recorded income is ₹${totalIncome.toLocaleString(
        "en-IN"
      )}.`;
    }

    if (
      q.includes("total expense") ||
      q.includes("how much did i spend") ||
      q.includes("my spending")
    ) {
      return `Your total recorded expenses are ₹${totalExpenses.toLocaleString(
        "en-IN"
      )}.`;
    }

    if (
      q.includes("balance") ||
      q.includes("money left") ||
      q.includes("available money")
    ) {
      return `Based on your recorded income and expenses, your available balance is ₹${availableBalance.toLocaleString(
        "en-IN"
      )}.`;
    }

    if (
      q.includes("where") &&
      q.includes("money")
    ) {
      if (!topCategory) {
        return "You haven't added enough expense data yet.";
      }

      return `Your highest spending category is ${
        topCategory[0]
      }, with ₹${topCategory[1].toLocaleString("en-IN")} spent.`;
    }

    if (
      q.includes("highest expense") ||
      q.includes("most spending") ||
      q.includes("top spending")
    ) {
      if (!topCategory) {
        return "No expenses have been recorded yet.";
      }

      return `You spend the most on ${
        topCategory[0]
      }: ₹${topCategory[1].toLocaleString("en-IN")}.`;
    }

    if (
      q.includes("save") ||
      q.includes("saving")
    ) {
      if (totalIncome === 0) {
        return "Start by recording your income. A useful savings target for many people is around 10–20% of income, depending on expenses and responsibilities.";
      }

      const suggested =
        Math.round(totalIncome * 0.2);

      return `A common starting target is to save around 20% of income. Based on your recorded income, that would be approximately ₹${suggested.toLocaleString(
        "en-IN"
      )}. Your current income minus expenses is ₹${availableBalance.toLocaleString(
        "en-IN"
      )}.`;
    }

    if (
      q.includes("emergency fund")
    ) {
      const monthlyBase =
        totalExpenses > 0 ? totalExpenses : 0;

      if (monthlyBase === 0) {
        return "An emergency fund is money kept aside for unexpected situations such as medical costs, urgent travel, repairs, or temporary loss of income. A common target is 3–6 months of essential expenses.";
      }

      return `A common emergency-fund target is 3–6 months of essential expenses. Based on ₹${monthlyBase.toLocaleString(
        "en-IN"
      )} of recorded expenses, that would roughly be ₹${(
        monthlyBase * 3
      ).toLocaleString("en-IN")} to ₹${(
        monthlyBase * 6
      ).toLocaleString("en-IN")}.`;
    }

    if (
      q.includes("sip")
    ) {
      return "A SIP (Systematic Investment Plan) lets you invest a fixed amount regularly, usually monthly, into a mutual fund. It encourages consistent investing and may benefit from rupee-cost averaging. Returns are market-linked, not guaranteed.";
    }

    if (
      q.includes("50/30/20") ||
      q.includes("budget rule")
    ) {
      return "The 50/30/20 rule is a simple budgeting guideline: around 50% for needs, 30% for wants, and 20% for savings or debt repayment. You can adjust the percentages based on your situation.";
    }

    if (
      q.includes("budget")
    ) {
      return "A good budget starts with income, fixed expenses, variable expenses and a savings target. Set category limits in FinWise, then compare your actual spending with those limits.";
    }

    if (
      q.includes("investment") ||
      q.includes("invest")
    ) {
      return "Before investing, consider having an emergency fund and controlling high-interest debt. Then choose investments based on your time horizon and risk tolerance. For long-term investing, diversified funds are often easier for beginners than selecting individual stocks.";
    }

    if (
      q.includes("stock") ||
      q.includes("share market")
    ) {
      return "Stocks represent ownership in companies and can fluctuate significantly. For beginners, diversification, long-term thinking, research and risk management are important. Avoid investing money you may need soon.";
    }

    if (
      q.includes("credit card")
    ) {
      return "Credit cards can be useful when balances are paid on time and in full. Carrying unpaid balances may lead to high interest charges. Treat a credit card as a payment tool, not extra income.";
    }

    if (
      q.includes("loan") ||
      q.includes("debt")
    ) {
      return "For debt management, list each loan's outstanding balance, interest rate and monthly payment. Prioritizing high-interest debt usually reduces total interest cost, while still making required payments on all debts.";
    }

    if (
      q.includes("afford")
    ) {
      const numberMatch = q
        .replace(/,/g, "")
        .match(/\d+/);

      if (!numberMatch) {
        return `Tell me the amount. For example: "Can I afford ₹5000?"`;
      }

      const amount = Number(numberMatch[0]);

      if (availableBalance >= amount) {
        return `Based only on the data currently recorded in FinWise, you have ₹${availableBalance.toLocaleString(
          "en-IN"
        )} available, which is enough to cover ₹${amount.toLocaleString(
          "en-IN"
        )}. Remember to consider upcoming bills and savings goals before spending it.`;
      }

      return `Your currently recorded available balance is ₹${availableBalance.toLocaleString(
        "en-IN"
      )}, so ₹${amount.toLocaleString(
        "en-IN"
      )} is above that amount.`;
    }

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {
      return "Hi! Ask me anything about budgeting, savings, spending, income, investments, SIPs, emergency funds, or your FinWise records.";
    }

    return `I can help with most personal-finance questions, but this version does not yet use a live AI model.

You can ask things like:
• How much have I spent?
• What is my balance?
• Where am I spending the most?
• How much should I save?
• What is SIP?
• Explain the 50/30/20 rule
• What is an emergency fund?
• How should I manage debt?
• Can I afford ₹5000?
• How should a beginner start investing?`;
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    const response = getAssistantAnswer(question);

    const assistantMessage: Message = {
      role: "assistant",
      content: response,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      assistantMessage,
    ]);

    setQuestion("");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">
          Smart AI Assistant
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Ask questions about your money and personal finance.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-white border text-gray-700"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={sendMessage}
          className="border-t bg-white p-4 flex gap-3"
        >
          <input
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask anything about your finances..."
            className="flex-1 border rounded-xl px-4 py-3"
          />

          <button
            type="submit"
            className="bg-primary text-white px-5 py-3 rounded-xl"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}