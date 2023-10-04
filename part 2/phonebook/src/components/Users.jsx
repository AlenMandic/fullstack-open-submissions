export default function DisplayUsers({ filterValue, userArray, handleDeleteCallback }) {

  function handleDelete(userId) {
    handleDeleteCallback(userId);
  }

  const displayUsers =
    // if no filter is set, show default data. If any input is set, show data based on the filter input.
    filterValue === ""
      ? userArray.map(person => (
        <div key={person.id} className="user-li">
            <li>
              {person.name} {person.number}
            </li>
            <button onClick={() => handleDelete(person.id)}>Delete</button>
          </div>
        ))
      : userArray.map(person =>
          person.name.toLowerCase().includes(filterValue.toLowerCase()) ? (
            <div key={person.id} className="user-li">
            <li>
              {person.name} {person.number}
            </li>
            <button onClick={() => handleDelete(person.id)}>Delete</button>
            </div>
          ) : null
        );

  return <ul>{displayUsers}</ul>;
}
