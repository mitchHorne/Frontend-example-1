import { render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { LoginCallback } from '../../pages'
import { renderAsync, wrapPageElement } from '../../testUtils'

const mockedAuth0 = jest.fn()
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: () => mockedAuth0()
}))

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: () => <div></div>
}))

describe('LoginCallback', () => {
  const handleRedirectCallback = jest.fn()
  const returnUrl = 'return/url'

  beforeEach(() => {
    mockedAuth0.mockReturnValue({ handleRedirectCallback })
  })

  it('should render without crashing', async () => {
    await act(async () => {
      render(wrapPageElement(LoginCallback, { Nav: () => <div></div> }))
    })
  })

  it('should render without providing Nav', async () => {
    await act(async () => {
      render(wrapPageElement(LoginCallback))
    })
  })

  describe('when callback result is undefined', () => {
    it('should render nothing', async () => {
      handleRedirectCallback.mockResolvedValue(undefined)

      const { container } = await renderAsync(
        wrapPageElement(LoginCallback, { Nav: () => <div></div> })
      )

      await waitFor(() => {
        expect(container.children.length).toEqual(0)
      })
    })
  })

  describe('when callback result is truthy', () => {
    it('should render Nav element', async () => {
      handleRedirectCallback.mockResolvedValue({ appState: { returnUrl } })

      const navRendered = jest.fn()
      const Nav = props => {
        navRendered(props)
        return <div data-testid='test-nav'></div>
      }

      const { getByTestId } = await renderAsync(
        wrapPageElement(LoginCallback, { Nav })
      )

      await waitFor(() => {
        const navElement = getByTestId('test-nav')

        expect(navElement).toBeInTheDocument()
        expect(navRendered).toHaveBeenCalledWith({
          to: returnUrl,
          replace: true
        })
      })
    })
  })

  describe('when return url is falsy', () => {
    it('should default return url to /', async () => {
      handleRedirectCallback.mockResolvedValue({
        appState: { returnUrl: null }
      })

      const navRendered = jest.fn()
      const Nav = props => {
        navRendered(props)
        return <div data-testid='test-nav'></div>
      }

      const { getByTestId } = await renderAsync(
        wrapPageElement(LoginCallback, { Nav })
      )

      await waitFor(() => {
        const navElement = getByTestId('test-nav')

        expect(navElement).toBeInTheDocument()
        expect(navRendered).toHaveBeenCalledWith({
          to: '/',
          replace: true
        })
      })
    })
  })

  describe('when handleRedirectCallback throws an error', () => {
    it('should render Nav element', async () => {
      handleRedirectCallback.mockRejectedValue(new Error('callback error'))

      const navRendered = jest.fn()
      const Nav = props => {
        navRendered(props)
        return <div data-testid='test-nav'></div>
      }

      const { getByTestId } = await renderAsync(
        wrapPageElement(LoginCallback, { Nav })
      )

      await waitFor(() => {
        const navElement = getByTestId('test-nav')

        expect(navElement).toBeInTheDocument()
        expect(navRendered).toHaveBeenCalledWith({
          to: '/',
          replace: true
        })
      })
    })
  })
})
