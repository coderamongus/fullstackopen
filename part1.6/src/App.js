import React, { useState } from 'react';

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
);

const StatisticLine = ({ text, value }) => (
  <div>
    {text} {value}
  </div>
);

const Statistics = ({ good, neutral, bad }) => {
  const totalFeedback = good + neutral + bad;
  const average = totalFeedback > 0 ? (good - bad) / totalFeedback : 0;
  const positivePercentage = totalFeedback > 0 ? (good / totalFeedback) * 100 : 0;

  if (totalFeedback === 0) {
    return <p>Ei Palautetta</p>;
  }

  return (
    <div>
      <h2>Statsit:</h2>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={totalFeedback} />
      <StatisticLine text="average" value={average.toFixed(2)} />
      <StatisticLine text="positive" value={`${positivePercentage.toFixed(2)}%`} />
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => setGood(good + 1);
  const handleNeutralClick = () => setNeutral(neutral + 1);
  const handleBadClick = () => setBad(bad + 1);

  return (
    <div>
      <h1>Anna Palautetta</h1>
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
