import React from 'react';

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <div>
      <p>Total of {totalExercises} exercises</p>
    </div>
  );
};

export default Total;
