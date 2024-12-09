import { render } from '@testing-library/react'
import PropTypes from 'prop-types'
import Router, { SecureRoute } from '../Router'
import { renderAsync, wrapPageElement } from '../testUtils'

const mockedUsedLocation = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockedUsedLocation()
}))

const mockedAuth0 = jest.fn()
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: () => mockedAuth0()
}))

describe('Router', () => {
  beforeEach(() => {
    mockedUsedLocation.mockReturnValue({ state: null })
  })

  it('renders without crashing', async () => {
    mockedAuth0.mockReturnValue({})
    await renderAsync(wrapPageElement(Router))
  })

  describe('SecureRoute', () => {
    const Element = () => <div>Secure Page</div>

    const props = {
      authed: { user: null },
      element: Element
    }

    it('should render the element if the user is logged in', () => {
      mockedAuth0.mockReturnValue({ isLoading: false })

      const { getByText } = render(
        wrapPageElement(SecureRoute, {
          ...props,
          authed: { user: {} },
          element: Element
        })
      )

      expect(mockedUsedLocation).toHaveBeenCalled()
      expect(getByText('Secure Page')).toBeInTheDocument()
    })

    it('should not render the element if user is not logged in', async () => {
      mockedAuth0.mockReturnValue({ isLoading: false })

      const NavMock = ({ to }) => (
        <div>
          <p>{to}</p>
        </div>
      )

      NavMock.propTypes = {
        to: PropTypes.string
      }

      const { getByText, queryByText } = render(
        wrapPageElement(SecureRoute, {
          ...props,
          authed: { user: null },
          element: Element,
          Nav: NavMock
        })
      )

      expect(mockedUsedLocation).toHaveBeenCalled()
      expect(queryByText('Secure Page')).not.toBeInTheDocument()
      expect(getByText('/logout/callback')).toBeInTheDocument()
    })

    describe('when auth0 is loading', () => {
      it('should render spinner', () => {
        mockedAuth0.mockReturnValue({ isLoading: true })

        const { getByTestId } = render(
          wrapPageElement(SecureRoute, {
            ...props,
            authed: { user: {} },
            element: Element
          })
        )

        expect(getByTestId('spinner')).toBeInTheDocument()
      })
    })
  })
})
