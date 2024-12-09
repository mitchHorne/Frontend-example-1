import { render, screen, fireEvent } from '@testing-library/react'
import ErrorFallback from '../ErrorFallback'

describe('ErrorFallback', () => {
  const error = new Error('Your use effect broke.')
  process.env.REACT_APP_BASE_URL = 'http://my-base-url'

  beforeEach(() => {
    render(<ErrorFallback error={error} />)
  })

  it('renders the error message', () => {
    const errorMessage = screen.getByText(/oops! something went wrong/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('renders the error message from the prop', () => {
    const errorMessage = screen.getByText(error.message)
    expect(errorMessage).toBeInTheDocument()
  })

  it('redirects the user to the root route of the application when the button is clicked', () => {
    const button = screen.getByRole('button', { name: /go back home/i })
    fireEvent.click(button)
    expect(window.location.href).toBe('http://localhost/')
  })
})
