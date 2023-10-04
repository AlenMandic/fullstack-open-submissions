import "./style.css";
import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import DisplayUsers from "./components/Users";
import Notification from "./components/Notification_one";
import registeredUsers from "./services/registeredUsers"; // import our back-end module with our needed services all backend functions

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    registeredUsers.getAll()
    .then(initialPersons => setPersons(initialPersons))
    .catch(err => alert(err))
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [ourFilter, setFilter] = useState("");
  const [addNotification, setAddNotification] = useState(null);

  function resetForm() {
    setNewName("");
    setNewNumber("");
    setFilter("");
  }

  function handleInput(e) {
    setNewName(e.target.value);
  }

  function handleNumberChange(e) {
    setNewNumber(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newPhoneObject = {
      name: newName,
      number: newNumber,
    };

    if (persons.find((person) => person.name === newPhoneObject.name)) {
      alert("Error. That username is already registered.");
      resetForm();
    } else if (
      persons.find((person) => person.number === newPhoneObject.number)
    ) {
      alert("Error. That number is already registered.");
      resetForm();
    } else {
      registeredUsers.createNewUser(newPhoneObject)
      .then(newUser => {
        setPersons(persons.concat(newUser))
        setAddNotification(newUser.name + ' added successfully!')
      })
      .catch(err => alert(err))
      
      setTimeout(() => {
        setAddNotification(null)
      }, 5000)
      resetForm();
    }
  }

  function handleFilter(e) {
    setFilter(e.target.value);
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      registeredUsers.deleteUser(id)
      const updatedUsers = persons.filter(person => id !== person.id)
      setPersons(updatedUsers)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addNotification} />
      <Filter filterValue={ourFilter} handleFilterFunction={handleFilter} />

      <Form
        submitHandler={handleSubmit}
        nameValue={newName}
        handleNameFunction={handleInput}
        numberValue={newNumber}
        handleNumberFunction={handleNumberChange}
      />

      <h2>Numbers</h2>
      <DisplayUsers filterValue={ourFilter} userArray={persons} handleDeleteCallback={handleDelete}/>
    </div>
  );
};

export default App;
