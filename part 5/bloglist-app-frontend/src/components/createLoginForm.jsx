import { React, useState } from 'react'
export default function CreateLoginForm({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword
}) {

  const [showLoginForm, setShowLoginForm] = useState(false)

  function handleShowForm() {
    setShowLoginForm(!showLoginForm)
  }

  function showForm() {
    if(showLoginForm) {
      return <div><form className="login-form" onSubmit={handleLogin}>
        <div>
       Username <input value={username} name="username-input" id="username-input" type="text" onChange={({
            target
          }) => setUsername(target.value)}></input>
        </div>
        <div>
       Password <input value={password} name="password-input" id="password-input" type="password" onChange={({
            target
          }) => setPassword(target.value)}></input>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <button onClick={handleShowForm}>Cancel</button>
      </div>
    } else {
      return <button onClick={handleShowForm}>Log in</button>
    }

  }

  return showForm()
}
