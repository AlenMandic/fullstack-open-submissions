export function NotificationError({ message }) {
  if(message === null) {
    return null
  }

  return <div className="error-notification"><h2>{message}</h2></div>
}

export function NotificationSuccess({ message }) {
  if(message === null) {
    return null
  }

  return <div className="success-notification"><h2>{message}</h2></div>
}