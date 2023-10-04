export default function Form({ submitHandler, nameValue, handleNameFunction, numberValue, handleNumberFunction}) {

    return (
        <form onSubmit={submitHandler}>
        <div>
          name: <input value={nameValue} onChange={handleNameFunction} />
        </div>
        <div>
          number: <input value={numberValue} onChange={handleNumberFunction} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}