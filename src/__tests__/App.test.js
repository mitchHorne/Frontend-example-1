import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import App from '../App'

it('renders learn react link', async () => {
  await act(async () => {
    render(<App />)
  })
})
