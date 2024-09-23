const express = require('express');
const app = express();
const PORT = 3001;

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-1234567' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-34-567890' },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

app.get('/info', (request, response) => {
  const currentTime = new Date().toString();
  const numberOfContacts = persons.length;
  
  response.send(`
    <div>
      <p>Phonebook has info for ${numberOfContacts} people</p>
      <p>${currentTime}</p>
    </div>
  `);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
