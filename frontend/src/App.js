import React from "react";
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import PersonNumber from "./components/PersonNumber";
import PersonForm from "./components/PersonForm";
import personService from "./services/personService";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilter] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const hook = () => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  };
  useEffect(hook, []);

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const addNewPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === personObject.name.toLowerCase()
    );

    if (existingPerson) {
      if (
        window.confirm(
          `${personObject.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(existingPerson.id, personObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            setMessage(`Updated ${returnedPerson.name}'s number`);
            setTimeout(() => {
              setMessage("");
            }, 5000);
          })
          .catch((err) => {
            setIsError(true);
            setTimeout(() => {
              setIsError(false);
            }, 5000);
          });
      }
    } else {
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setMessage(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setMessage("");
          }, 5000);
        })
        .catch((err) => {
          console.log(err.response.data.error);
          setMessage(err.response.data.error);
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
            setMessage("");
          }, 5000);
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const deleteEntry = (id) => {
    const personToBeDeleted = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${personToBeDeleted.name}?`)) {
      personService
        .deletePerson(id)
        .then((res) => setPersons(persons.filter((person) => person.id !== id)))
        .catch((err) => {
          setMessage(
            `Information of ${personToBeDeleted.name} has already been removed from server`
          );
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
          }, 5000);
        });
    }
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isErrorMessage={isError} />
      <Filter filterName={filterName} handleFilter={handleFilter} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addNewPerson={addNewPerson}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
      />
      <h3>Numbers</h3>
      <ul>
        {filteredPersons.map((person) => (
          <PersonNumber
            name={person.name}
            number={person.number}
            key={person.id}
            deleteHandle={() => deleteEntry(person.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
