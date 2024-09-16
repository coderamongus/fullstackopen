import React, { useState, useEffect } from 'react';
import phonebookService from './phonebookService'; 
import Notification from './Notification'; 

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
  
    const personObject = {
      name: newName,
      number: newNumber,
    };
  
    const existingPerson = persons.find(person => person.name === newName);
  
    if (existingPerson) {
      if (window.confirm(`${newName} on jo listalla, vaihdetaanko numero uuteen?`)) {
        phonebookService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
            setSuccessMessage(`Päivitetty ${returnedPerson.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setErrorMessage(`Henkilö ${newName} on poistettu, ei voida päivittää.`);
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            } else {
              setErrorMessage(`Virhe päivittäessä ${newName}: ${error.response.data.error}`);
              setTimeout(() => {
                setErrorMessage(null);
              }, 5000);
            }
          });
      }
    } else {
      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`Lisätty ${returnedPerson.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch(error => {
          setErrorMessage(`Virhe lisätessä ${newName}: ${error.response.data.error}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const deletePerson = id => {
    const person = persons.find(p => p.id === id);
    if (window.confirm(`Poistetaanko ${person.name}?`)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setSuccessMessage(`Poistettu ${person.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            setErrorMessage(`${person.name} on jo poistettu.`);
            setPersons(persons.filter(p => p.id !== id));
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          } else {
            setErrorMessage(`Virhe poistettaessa ${person.name}: ${error.response.data.error}`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          }
        });
    }
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map(person =>
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default App;
