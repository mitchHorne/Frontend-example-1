import { render } from '@testing-library/react'
import { Login } from '../../pages'
import { wrapPageElement } from '../../testUtils'

const mockedUseLocation = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockedUseLocation()
}))

const mockedAuth0 = jest.fn()
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: () => mockedAuth0()
}))

describe('Login', () => {
  const defaultUser = { name: 'john smith' }
  const mockAuth0 = (
    isLoading = false,
    user = defaultUser,
    loginWithRedirect = () => {}
  ) => {
    mockedAuth0.mockReturnValue({
      isLoading,
      user,
      loginWithRedirect
    })
  }

  beforeEach(() => {
    jest.resetAllMocks()
    mockedUseLocation.mockReturnValue({})
  })

  it('renders without crashing', () => {
    mockAuth0()
    render(wrapPageElement(Login, { authed: {} }))
  })

  it('should render login component if not authed', () => {
    mockAuth0(false, null)

    const { getByTestId } = render(wrapPageElement(Login, { authed: {} }))

    const loginComponent = getByTestId('login-component')
    expect(loginComponent).toBeInTheDocument()
  })

  it('should redirect if the user is already logged in', () => {
    mockAuth0()

    const returnUrl = '/some-url'
    mockedUseLocation.mockReturnValue({ state: { returnUrl } })

    const mockedUsedNavigate = jest.fn()
    const Navigate = props => {
      mockedUsedNavigate(props)
      return <div>Navigate Component</div>
    }

    const { getByText } = render(
      wrapPageElement(Login, { authed: { user: {} }, Nav: Navigate })
    )

    const navElement = getByText('Navigate Component')

    expect(navElement).toBeInTheDocument()
    expect(mockedUsedNavigate).toHaveBeenCalled()
    expect(mockedUsedNavigate).toHaveBeenCalledWith({
      to: returnUrl,
      replace: true
    })
  })

  it('should render a spinner if auth is loading', () => {
    mockAuth0(true, null)

    const { getByTestId } = render(wrapPageElement(Login))

    expect(getByTestId('spinner')).toBeInTheDocument()
  })

  it('should render a spinner if auth has a user', () => {
    mockAuth0(false)

    const { getByTestId } = render(wrapPageElement(Login))

    expect(getByTestId('spinner')).toBeInTheDocument()
  })

  it('should render a login button with redirection when not loading or have a user', async () => {
    const mockLoginWithRedirect = jest.fn()
    mockAuth0(false, null, mockLoginWithRedirect)

    const { getByTestId, queryByTestId } = render(wrapPageElement(Login))

    expect(queryByTestId('spinner')).not.toBeInTheDocument()
    expect(getByTestId('login-button')).toBeInTheDocument()

    await getByTestId('login-button').click()
    expect(mockLoginWithRedirect).toHaveBeenCalled()
  })
})
