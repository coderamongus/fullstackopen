import React, { useState } from 'react';

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
);

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good - bad) / total;
  const positivePercentage = total === 0 ? 0 : (good / total) * 100;

  if (total === 0) {
    return <div>Ei palautetta viel</div>;
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="Good" value={good} />
        <StatisticLine text="Neutral" value={neutral} />
        <StatisticLine text="Bad" value={bad} />
        <StatisticLine text="All" value={total} />
        <StatisticLine text="Average" value={average.toFixed(2)} />
        <StatisticLine text="Positive" value={`${positivePercentage.toFixed(2)}%`} />
      </tbody>
    </table>
  );
};

const Anecdotes = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place...'
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const handleNextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const handleVote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  const highestVotesIndex = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <h1>Päivän anekdootti</h1>
      <p>"{anecdotes[selected]}" Sai {votes[selected]} ääntä</p>
      <button onClick={handleVote}>äänestä</button>
      <button onClick={handleNextAnecdote}>seuraava</button>

      <h1>Äänestetyin Anekdootti</h1>
      {votes[highestVotesIndex] > 0 ? (
        <div>
          <p>"{anecdotes[highestVotesIndex]}" Sai {votes[highestVotesIndex]} ääntä</p>
          <p> </p>
        </div>
      ) : (
        <p>Ei Ääniä Vielä</p>
      )}
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

      <hr />

      <Anecdotes />
    </div>
  );
};

export default App;
