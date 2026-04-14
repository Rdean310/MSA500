import { useMemo, useState } from 'react';

const quizQuestions = [
  {
    id: 1,
    question:
      'River Co. buys 25% of Lake Co. for $400,000 and has significant influence. During the year, Lake reports net income of $120,000 and pays dividends of $40,000. What amount should River report as equity method income?',
    choices: ['$20,000', '$25,000', '$30,000', '$40,000'],
    answer: 2,
    explanation:
      'Equity method income = 25% × $120,000 = $30,000. Dividends reduce the investment account, not equity method income.'
  },
  {
    id: 2,
    question: 'Which situation most likely requires the equity method?',
    choices: [
      '12% ownership, no board seat, passive investment',
      '18% ownership, board seat, active role in policy decisions',
      '70% ownership, investor controls operations',
      '5% ownership, no influence'
    ],
    answer: 1,
    explanation:
      'Even below 20%, the facts can still show significant influence. A board seat and policy involvement point toward the equity method.'
  },
  {
    id: 3,
    question: 'Under the equity method, cash dividends received from the investee are generally recorded as:',
    choices: [
      'Dividend revenue',
      'A reduction of the investment account',
      'Other comprehensive income',
      'An unrealized gain'
    ],
    answer: 1,
    explanation:
      'Dividends are not dividend revenue under the equity method. They reduce the carrying amount of the investment.'
  }
];

function formatMoney(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(number);
}

function closeEnough(a, b) {
  return Math.abs(Number(a) - Number(b)) < 1;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('learn');

  const [purchasePrice, setPurchasePrice] = useState('240000');
  const [ownershipPercent, setOwnershipPercent] = useState('30');
  const [investeeIncome, setInvesteeIncome] = useState('80000');
  const [investeeDividends, setInvesteeDividends] = useState('20000');

  const [answerIncome, setAnswerIncome] = useState('');
  const [answerDividends, setAnswerDividends] = useState('');
  const [answerEnding, setAnswerEnding] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [checkedExample, setCheckedExample] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const ownershipDecimal = Number(ownershipPercent) / 100;
  const shareOfIncome = Number(investeeIncome) * ownershipDecimal;
  const shareOfDividends = Number(investeeDividends) * ownershipDecimal;
  const endingInvestment = Number(purchasePrice) + shareOfIncome - shareOfDividends;

  const exampleScore = useMemo(() => {
    let score = 0;
    if (closeEnough(answerIncome, shareOfIncome)) score += 1;
    if (closeEnough(answerDividends, shareOfDividends)) score += 1;
    if (closeEnough(answerEnding, endingInvestment)) score += 1;
    return score;
  }, [answerIncome, answerDividends, answerEnding, shareOfIncome, shareOfDividends, endingInvestment]);

  const quizScore = quizQuestions.reduce((total, question) => {
    return total + (selectedAnswers[question.id] === question.answer ? 1 : 0);
  }, 0);

  const progress = Math.round(((checkedExample ? exampleScore / 3 : 0) + (submittedQuiz ? quizScore / quizQuestions.length : 0)) / 2 * 100);

  function resetSite() {
    setActiveTab('learn');
    setAnswerIncome('');
    setAnswerDividends('');
    setAnswerEnding('');
    setShowSteps(false);
    setCheckedExample(false);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  }

  return (
    <div className="page-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">FAR student review website</p>
          <h1>Equity Method for Investments</h1>
          <p className="hero-text">
            A simple companion site for your presentation with a quick concept review, an interactive worked example,
            and practice questions students can check on their own.
          </p>
          <p className="credit-line">Based on your final class presentation by Nicholas Yablunosky and Ryan Dean.</p>
        </div>
        <div className="progress-card">
          <h2>Your progress</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-label">{progress}% complete</p>
          <div className="mini-grid">
            <div className="mini-stat">
              <strong>Worked example</strong>
              <span>{checkedExample ? `${exampleScore}/3 correct` : 'Not checked yet'}</span>
            </div>
            <div className="mini-stat">
              <strong>Quiz</strong>
              <span>{submittedQuiz ? `${quizScore}/${quizQuestions.length} correct` : 'Not submitted yet'}</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="tab-row">
        <button className={activeTab === 'learn' ? 'tab active' : 'tab'} onClick={() => setActiveTab('learn')}>Learn</button>
        <button className={activeTab === 'example' ? 'tab active' : 'tab'} onClick={() => setActiveTab('example')}>Worked Example</button>
        <button className={activeTab === 'quiz' ? 'tab active' : 'tab'} onClick={() => setActiveTab('quiz')}>Practice Quiz</button>
        <button className="tab reset" onClick={resetSite}>Reset</button>
      </nav>

      {activeTab === 'learn' && (
        <section className="content-grid two-one">
          <article className="card">
            <h2>Main idea</h2>
            <div className="callout">
              If the investor has <strong>significant influence</strong>, it records its share of the investee's income or loss and reduces the investment for dividends received.
            </div>
            <h3>When do we usually think equity method?</h3>
            <p>
              Usually around <strong>20% to 50%</strong> ownership, but the facts matter too. The percentage is a clue, not the entire answer.
            </p>
            <div className="split-boxes">
              <div className="info-box">
                <h4>Signs of significant influence</h4>
                <ul>
                  <li>Board representation</li>
                  <li>Participation in policy decisions</li>
                  <li>Material intercompany transactions</li>
                  <li>Management overlap</li>
                </ul>
              </div>
              <div className="info-box">
                <h4>When not to use it</h4>
                <ul>
                  <li>Little or no influence → another investment model</li>
                  <li>Control over 50% → consolidation</li>
                  <li>Passive investment → not equity method</li>
                </ul>
              </div>
            </div>
          </article>

          <aside className="card side-card">
            <h2>Fast exam memory trick</h2>
            <div className="dark-callout">20–50% = think equity method first, then check the facts.</div>
            <div className="formula-box">
              <h3>Rollforward to memorize</h3>
              <p>
                Beginning investment<br />
                + Share of net income<br />
                − Share of dividends<br />
                = Ending investment
              </p>
            </div>
            <div className="warning-box">
              <strong>Big trap:</strong> Dividends are not dividend revenue under the equity method.
            </div>
          </aside>
        </section>
      )}

      {activeTab === 'example' && (
        <section className="content-grid two-one">
          <article className="card">
            <h2>Try the worked example</h2>
            <p className="section-intro">
              Assume the investor has significant influence. Fill in the inputs below, then solve for share of income, share of dividends, and ending investment.
            </p>

            <div className="input-grid">
              <label>
                Purchase price
                <input value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
              </label>
              <label>
                Ownership %
                <input value={ownershipPercent} onChange={(e) => setOwnershipPercent(e.target.value)} />
              </label>
              <label>
                Investee net income
                <input value={investeeIncome} onChange={(e) => setInvesteeIncome(e.target.value)} />
              </label>
              <label>
                Investee dividends
                <input value={investeeDividends} onChange={(e) => setInvesteeDividends(e.target.value)} />
              </label>
            </div>

            <div className="input-grid answers">
              <label>
                Your share of net income
                <input value={answerIncome} onChange={(e) => setAnswerIncome(e.target.value)} placeholder="Enter amount" />
              </label>
              <label>
                Your share of dividends
                <input value={answerDividends} onChange={(e) => setAnswerDividends(e.target.value)} placeholder="Enter amount" />
              </label>
              <label>
                Ending investment
                <input value={answerEnding} onChange={(e) => setAnswerEnding(e.target.value)} placeholder="Enter amount" />
              </label>
            </div>

            <div className="button-row">
              <button className="primary-button" onClick={() => setCheckedExample(true)}>Check answers</button>
              <button className="secondary-button" onClick={() => setShowSteps(!showSteps)}>{showSteps ? 'Hide steps' : 'Show steps'}</button>
            </div>

            {checkedExample && (
              <div className="feedback-grid">
                <div className={closeEnough(answerIncome, shareOfIncome) ? 'feedback-card correct' : 'feedback-card incorrect'}>
                  <strong>Share of net income</strong>
                  <span>Correct answer: {formatMoney(shareOfIncome)}</span>
                </div>
                <div className={closeEnough(answerDividends, shareOfDividends) ? 'feedback-card correct' : 'feedback-card incorrect'}>
                  <strong>Share of dividends</strong>
                  <span>Correct answer: {formatMoney(shareOfDividends)}</span>
                </div>
                <div className={closeEnough(answerEnding, endingInvestment) ? 'feedback-card correct' : 'feedback-card incorrect'}>
                  <strong>Ending investment</strong>
                  <span>Correct answer: {formatMoney(endingInvestment)}</span>
                </div>
              </div>
            )}

            {showSteps && (
              <div className="steps-box">
                <p><strong>Step 1:</strong> Share of net income = {ownershipPercent}% × {formatMoney(investeeIncome)} = <strong>{formatMoney(shareOfIncome)}</strong></p>
                <p><strong>Step 2:</strong> Share of dividends = {ownershipPercent}% × {formatMoney(investeeDividends)} = <strong>{formatMoney(shareOfDividends)}</strong></p>
                <p><strong>Step 3:</strong> Ending investment = {formatMoney(purchasePrice)} + {formatMoney(shareOfIncome)} − {formatMoney(shareOfDividends)} = <strong>{formatMoney(endingInvestment)}</strong></p>
                <div className="journal-box">
                  <h3>Journal entries</h3>
                  <p>Dr Investment {formatMoney(shareOfIncome)}</p>
                  <p>Cr Equity in earnings {formatMoney(shareOfIncome)}</p>
                  <p className="journal-gap">Dr Cash {formatMoney(shareOfDividends)}</p>
                  <p>Cr Investment {formatMoney(shareOfDividends)}</p>
                </div>
              </div>
            )}
          </article>

          <aside className="card side-card">
            <h2>What students should notice</h2>
            <div className="info-stack">
              <div className="info-chip">Equity method income comes from the investee's net income.</div>
              <div className="info-chip">Dividends reduce the investment account.</div>
              <div className="info-chip">The investment account changes using the rollforward.</div>
            </div>
          </aside>
        </section>
      )}

      {activeTab === 'quiz' && (
        <section className="quiz-layout">
          {quizQuestions.map((question, index) => {
            const hasAnswer = selectedAnswers[question.id] !== undefined;
            const isCorrect = selectedAnswers[question.id] === question.answer;
            return (
              <article className="card quiz-card" key={question.id}>
                <h2>Question {index + 1}</h2>
                <p className="quiz-question">{question.question}</p>
                <div className="choice-list">
                  {question.choices.map((choice, choiceIndex) => {
                    let className = 'choice-button';
                    if (selectedAnswers[question.id] === choiceIndex) className += ' selected';
                    if (submittedQuiz && question.answer === choiceIndex) className += ' correct-choice';
                    if (submittedQuiz && selectedAnswers[question.id] === choiceIndex && question.answer !== choiceIndex) className += ' wrong-choice';

                    return (
                      <button
                        key={choice}
                        className={className}
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [question.id]: choiceIndex }))}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {submittedQuiz && hasAnswer && (
                  <div className={isCorrect ? 'explanation-box good' : 'explanation-box review'}>
                    <strong>{isCorrect ? 'Correct' : 'Review this one'}</strong>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </article>
            );
          })}

          <div className="quiz-footer">
            <button className="primary-button" onClick={() => setSubmittedQuiz(true)}>Submit quiz</button>
            {submittedQuiz && <div className="score-box">Score: {quizScore} / {quizQuestions.length}</div>}
          </div>
        </section>
      )}
    </div>
  );
}
