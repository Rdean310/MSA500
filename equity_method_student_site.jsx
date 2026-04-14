import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Calculator, BookOpen, PenSquare, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const quizQuestions = [
  {
    id: 1,
    question:
      "River Co. buys 25% of Lake Co. for $400,000 and has significant influence. During the year, Lake reports net income of $120,000 and pays dividends of $40,000. What amount should River report as equity method income?",
    choices: ["$20,000", "$25,000", "$30,000", "$40,000"],
    answer: 2,
    explanation:
      "Equity method income = 25% × $120,000 = $30,000. Dividends reduce the investment account, not equity method income.",
  },
  {
    id: 2,
    question: "Which situation most likely requires the equity method?",
    choices: [
      "12% ownership, no board seat, passive investment",
      "18% ownership, board seat, active role in policy decisions",
      "70% ownership, investor controls operations",
      "5% ownership, no influence",
    ],
    answer: 1,
    explanation:
      "Even below 20%, the facts can show significant influence. A board seat and policy involvement point toward the equity method.",
  },
  {
    id: 3,
    question: "Under the equity method, cash dividends received from the investee are generally recorded as:",
    choices: [
      "Dividend revenue",
      "A reduction of the investment account",
      "Other comprehensive income",
      "An unrealized gain",
    ],
    answer: 1,
    explanation:
      "Dividends are not dividend revenue under the equity method. They reduce the carrying amount of the investment.",
  },
];

function money(value) {
  const number = Number(String(value).replace(/[$, ]/g, ""));
  if (Number.isNaN(number)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(number);
}

function isClose(a, b) {
  return Math.abs(Number(a) - Number(b)) < 1;
}

export default function EquityMethodStudentSite() {
  const [tab, setTab] = useState("learn");
  const [showSteps, setShowSteps] = useState(false);

  const [purchasePrice, setPurchasePrice] = useState("240000");
  const [ownership, setOwnership] = useState("30");
  const [investeeIncome, setInvesteeIncome] = useState("80000");
  const [investeeDividends, setInvesteeDividends] = useState("20000");

  const ownPct = Number(ownership) / 100;
  const shareIncome = Number(investeeIncome) * ownPct;
  const shareDividends = Number(investeeDividends) * ownPct;
  const endingInvestment = Number(purchasePrice) + shareIncome - shareDividends;

  const [answerIncome, setAnswerIncome] = useState("");
  const [answerDividends, setAnswerDividends] = useState("");
  const [answerEnding, setAnswerEnding] = useState("");
  const [checkedExample, setCheckedExample] = useState(false);

  const exampleScore = useMemo(() => {
    let score = 0;
    if (isClose(answerIncome, shareIncome)) score += 1;
    if (isClose(answerDividends, shareDividends)) score += 1;
    if (isClose(answerEnding, endingInvestment)) score += 1;
    return score;
  }, [answerIncome, answerDividends, answerEnding, shareIncome, shareDividends, endingInvestment]);

  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const quizScore = quizQuestions.reduce((total, q) => {
    return total + (selected[q.id] === q.answer ? 1 : 0);
  }, 0);

  const overallProgress = Math.round(((checkedExample ? exampleScore / 3 : 0) + (submitted ? quizScore / quizQuestions.length : 0)) / 2 * 100);

  const resetAll = () => {
    setShowSteps(false);
    setAnswerIncome("");
    setAnswerDividends("");
    setAnswerEnding("");
    setCheckedExample(false);
    setSelected({});
    setSubmitted(false);
    setTab("learn");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="mb-3 rounded-full">FAR student review</Badge>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Equity Method for Investments</h1>
              <p className="mt-3 max-w-3xl text-base text-slate-600 md:text-lg">
                A simple companion site for the presentation with a quick concept review, a worked example,
                and practice questions students can check on their own.
              </p>
            </div>
            <Card className="w-full md:w-80 rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-slate-100 p-3">
                    <div className="font-semibold">Worked example</div>
                    <div className="text-slate-600">{checkedExample ? `${exampleScore}/3 correct` : "Not checked yet"}</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <div className="font-semibold">Quiz</div>
                    <div className="text-slate-600">{submitted ? `${quizScore}/${quizQuestions.length} correct` : "Not submitted yet"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            ["learn", "Learn"],
            ["example", "Worked Example"],
            ["quiz", "Practice Quiz"],
          ].map(([key, label]) => (
            <Button
              key={key}
              variant={tab === key ? "default" : "outline"}
              className="rounded-2xl"
              onClick={() => setTab(key)}
            >
              {label}
            </Button>
          ))}
          <Button variant="ghost" className="rounded-2xl" onClick={resetAll}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        {tab === "learn" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-2xl shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="h-5 w-5" /> Main idea
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm leading-6 md:text-base">
                <div className="rounded-2xl bg-slate-100 p-4">
                  If the investor has <span className="font-semibold">significant influence</span>, it records its
                  share of the investee’s income or loss and reduces the investment for dividends received.
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">When do we usually think equity method?</h3>
                  <p className="text-slate-700">
                    Usually around <span className="font-semibold">20% to 50%</span> ownership, but the facts matter.
                    The percentage is a clue, not the whole answer.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border p-4">
                    <div className="mb-2 font-semibold">Signs of significant influence</div>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Board representation</li>
                      <li>• Participation in policy decisions</li>
                      <li>• Material intercompany transactions</li>
                      <li>• Management overlap</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border p-4">
                    <div className="mb-2 font-semibold">When not to use it</div>
                    <ul className="space-y-2 text-slate-700">
                      <li>• Little or no influence → other investment model</li>
                      <li>• Control over 50% → consolidation</li>
                      <li>• Passive investment → not equity method</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Fast exam memory trick</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm md:text-base">
                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  20–50% = think equity method first, then check the facts.
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <div className="mb-2 font-semibold">Rollforward to memorize</div>
                  <div className="text-lg font-bold leading-8">
                    Beginning investment<br />
                    + Share of net income<br />
                    − Share of dividends<br />
                    = Ending investment
                  </div>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="font-semibold">Big trap</div>
                  <p className="mt-1 text-slate-700">Dividends are not dividend revenue under the equity method.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === "example" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-2xl shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calculator className="h-5 w-5" /> Try the worked example
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Purchase price</label>
                    <Input value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} className="rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Ownership %</label>
                    <Input value={ownership} onChange={(e) => setOwnership(e.target.value)} className="rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Investee net income</label>
                    <Input value={investeeIncome} onChange={(e) => setInvesteeIncome(e.target.value)} className="rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Investee dividends</label>
                    <Input value={investeeDividends} onChange={(e) => setInvesteeDividends(e.target.value)} className="rounded-xl" />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-100 p-4 text-sm leading-6 md:text-base">
                  Assume the investor has significant influence. Compute the investor’s share of income,
                  share of dividends, and ending investment balance.
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Your share of net income</label>
                    <Input value={answerIncome} onChange={(e) => setAnswerIncome(e.target.value)} placeholder="Enter amount" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Your share of dividends</label>
                    <Input value={answerDividends} onChange={(e) => setAnswerDividends(e.target.value)} placeholder="Enter amount" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Ending investment</label>
                    <Input value={answerEnding} onChange={(e) => setAnswerEnding(e.target.value)} placeholder="Enter amount" className="rounded-xl" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-2xl" onClick={() => setCheckedExample(true)}>Check answers</Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => setShowSteps((v) => !v)}>
                    {showSteps ? "Hide steps" : "Show steps"}
                  </Button>
                </div>

                {checkedExample && (
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      ["Share of net income", answerIncome, shareIncome],
                      ["Share of dividends", answerDividends, shareDividends],
                      ["Ending investment", answerEnding, endingInvestment],
                    ].map(([label, answer, correct]) => {
                      const ok = isClose(answer, correct);
                      return (
                        <div key={label} className={`rounded-2xl border p-4 ${ok ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                          <div className="mb-2 flex items-center gap-2 font-semibold">
                            {ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            {label}
                          </div>
                          <div className="text-sm text-slate-700">Correct answer: {money(correct)}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {showSteps && (
                  <div className="space-y-3 rounded-2xl border p-4 text-sm leading-6 md:text-base">
                    <div><span className="font-semibold">Step 1:</span> Share of net income = {ownership}% × {money(investeeIncome)} = <span className="font-semibold">{money(shareIncome)}</span></div>
                    <div><span className="font-semibold">Step 2:</span> Share of dividends = {ownership}% × {money(investeeDividends)} = <span className="font-semibold">{money(shareDividends)}</span></div>
                    <div><span className="font-semibold">Step 3:</span> Ending investment = {money(purchasePrice)} + {money(shareIncome)} − {money(shareDividends)} = <span className="font-semibold">{money(endingInvestment)}</span></div>
                    <div className="rounded-xl bg-slate-100 p-3">
                      <div className="font-semibold">Journal entries</div>
                      <div className="mt-2">Dr Investment {money(shareIncome)}</div>
                      <div>Cr Equity in earnings {money(shareIncome)}</div>
                      <div className="mt-3">Dr Cash {money(shareDividends)}</div>
                      <div>Cr Investment {money(shareDividends)}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">What students should notice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm md:text-base">
                <div className="rounded-2xl bg-slate-100 p-4">
                  Equity method income comes from the <span className="font-semibold">investee’s net income</span>, not from dividends.
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  Dividends <span className="font-semibold">reduce the investment account</span>.
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  The investment account changes with a simple rollforward.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === "quiz" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {quizQuestions.map((q, idx) => {
                const isCorrect = selected[q.id] === q.answer;
                const hasAnswer = selected[q.id] !== undefined;
                return (
                  <Card key={q.id} className="rounded-2xl shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <PenSquare className="h-5 w-5" /> Question {idx + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm leading-6 text-slate-700 md:text-base">{q.question}</p>
                      <div className="space-y-2">
                        {q.choices.map((choice, choiceIdx) => {
                          const picked = selected[q.id] === choiceIdx;
                          const revealCorrect = submitted && q.answer === choiceIdx;
                          const revealWrong = submitted && picked && q.answer !== choiceIdx;
                          return (
                            <button
                              key={choice}
                              onClick={() => setSelected((prev) => ({ ...prev, [q.id]: choiceIdx }))}
                              className={`w-full rounded-2xl border p-3 text-left text-sm transition ${picked ? "border-slate-900 bg-slate-100" : "border-slate-200 bg-white"} ${revealCorrect ? "border-emerald-300 bg-emerald-50" : ""} ${revealWrong ? "border-rose-300 bg-rose-50" : ""}`}
                            >
                              {choice}
                            </button>
                          );
                        })}
                      </div>
                      {submitted && hasAnswer && (
                        <div className={`rounded-2xl p-4 text-sm ${isCorrect ? "bg-emerald-50" : "bg-amber-50"}`}>
                          <div className="font-semibold">{isCorrect ? "Correct" : "Review this one"}</div>
                          <div className="mt-1 text-slate-700">{q.explanation}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button className="rounded-2xl" onClick={() => setSubmitted(true)}>Submit quiz</Button>
              {submitted && (
                <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold">
                  Score: {quizScore} / {quizQuestions.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
git rm filename
git commit -m "Delete filename"
git push

