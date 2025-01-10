const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.json());
app.use(express.static(path.join(__dirname))); 

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-1234567' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-34-567890' },
  { id: 4, name: 'Dani Kabrdamov', number: '122-34-567890' },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  const nameExists = persons.some(person => person.name === name);
  const numberExists = persons.some(person => person.number === number);

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  if (nameExists) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  if (numberExists) {
    return res.status(400).json({ error: 'Number must be unique' });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name,
    number,
  };

  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Puhelinluettelo</title>
    </head>
    <body>
      <h2>Puhelinluettelo</h2>
      <form id="contact-form">
        <div>
          Name: <input id="name" required />
        </div>
        <div>
          Number: <input id="number" required />
        </div>
        <button type="submit">Add</button>
      </form>
      <h2>Search</h2>
      <input id="search" placeholder="Search by name" />
      <h2>Contacts</h2>
      <ul id="contact-list"></ul>

      <script>
        const form = document.getElementById('contact-form');
        const contactList = document.getElementById('contact-list');
        const searchInput = document.getElementById('search');

        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const name = document.getElementById('name').value;
          const number = document.getElementById('number').value;

          if (!name || !number) {
            alert('Name and number are required.');
            return;
          }

          const response = await fetch('/api/persons', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, number }),
          });

          if (response.ok) {
            const newPerson = await response.json();
            addContactToList(newPerson);
            form.reset();
          } else {
            const error = await response.json();
            alert(error.error);
          }
        });

        const addContactToList = (person) => {
          const li = document.createElement('li');
          li.innerText = \`\${person.name} \${person.number} \`;
          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'Delete';
          deleteButton.onclick = async () => {
            await fetch(\`/api/persons/\${person.id}\`, { method: 'DELETE' });
            li.remove();
          };
          li.appendChild(deleteButton);
          contactList.appendChild(li);
        };

        const fetchContacts = async () => {
          const response = await fetch('/api/persons');
          const data = await response.json();
          data.forEach(addContactToList);
        };

        searchInput.addEventListener('input', () => {
          const searchValue = searchInput.value.toLowerCase();
          const contacts = Array.from(contactList.children);
          contacts.forEach(li => {
            const name = li.innerText.split(' ')[0].toLowerCase(); 
            li.style.display = name.includes(searchValue) ? '' : 'none';
          });
        });

        fetchContacts();
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});
