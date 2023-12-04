import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationSuccess } from './Notification'

test('Notification component renders content', () => {

  const message = 'testing notification component'

  render(<NotificationSuccess message={message} />)

  const element = screen.getByText('testing notification component')
  expect(element).toBeDefined()
})
