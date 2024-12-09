import { render, waitFor } from '@testing-library/react'
import { LogoutCallback } from '../../pages'
import { wrapPageElement } from '../../testUtils'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: () => <div></div>
}))

describe('LogoutCallback', () => {
  it('should render without crashing', () => {
    render(wrapPageElement(LogoutCallback, { Nav: () => <div></div> }))
  })

  it('should render without providing Nav', () => {
    render(wrapPageElement(LogoutCallback))
  })

  it('should render Nav element', async () => {
    const navRendered = jest.fn()
    const Nav = props => {
      navRendered(props)
      return <div data-testid='test-nav'></div>
    }

    const { getByTestId } = render(wrapPageElement(LogoutCallback, { Nav }))

    await waitFor(() => {
      const navElement = getByTestId('test-nav')

      expect(navElement).toBeInTheDocument()
      expect(navRendered).toHaveBeenCalledWith({
        to: '/login',
        state: null,
        replace: true
      })
    })
  })

  describe('when return url is falsy', () => {
    it('should default return url to /', async () => {
      const navRendered = jest.fn()
      const Nav = props => {
        navRendered(props)
        return <div data-testid='test-nav'></div>
      }

      const { getByTestId } = render(wrapPageElement(LogoutCallback, { Nav }))

      await waitFor(() => {
        const navElement = getByTestId('test-nav')

        expect(navElement).toBeInTheDocument()
        expect(navRendered).toHaveBeenCalledWith({
          to: '/login',
          state: null,
          replace: true
        })
      })
    })
  })
})
