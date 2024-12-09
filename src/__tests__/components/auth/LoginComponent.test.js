import { render } from '@testing-library/react'
import { wrapPageElement } from '../../../testUtils'
import { LoginComponent } from '../../../components'

const mockedAuth0 = jest.fn()
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: () => mockedAuth0()
}))

describe('LoginComponent', () => {
  const logout = jest.fn()

  beforeEach(() => {
    logout.mockReset()

    mockedAuth0.mockReturnValue({ logout })
  })

  it('should render without crashing', () => {
    render(
      wrapPageElement(LoginComponent, {
        authTriggered: false,
        handleLogin: () => {},
        authFailed: false
      })
    )
  })

  describe('when auth is triggered', () => {
    it('should show spinner', () => {
      const { getByTestId, queryByTestId } = render(
        wrapPageElement(LoginComponent, {
          authTriggered: true,
          handleLogin: () => {},
          authFailed: false
        })
      )

      expect(getByTestId('spinner')).toBeInTheDocument()
      expect(queryByTestId('login-button')).not.toBeInTheDocument()
    })
  })
})
