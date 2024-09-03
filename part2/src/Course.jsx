import React from 'react';
import Part from './Part';
import Total from './Total';

const Course = ({ course }) => {
  return (
    <div>
      <h2>{course.name}</h2>
      {course.parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
