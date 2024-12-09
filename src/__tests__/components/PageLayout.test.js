import { waitFor } from '@testing-library/react'
import { PageLayout } from '../../components'
import { renderAsync, wrapPageElement } from '../../testUtils'
import PropTypes from 'prop-types'

const mockedAuth0 = jest.fn()
jest.mock('@auth0/auth0-react', () => ({
  ...jest.requireActual('@auth0/auth0-react'),
  useAuth0: () => mockedAuth0()
}))

describe('PageLayout', () => {
  const user = { id: '1', name: 'user name' }
  const logout = jest.fn()

  beforeEach(() => {
    mockedAuth0.mockReturnValue({
      logout
    })
  })

  it('should render without crashing', async () => {
    await renderAsync(wrapPageElement(PageLayout, { user }))
  })

  it('should render children with menu', async () => {
    const TestElement = ({ user }) => (
      <PageLayout user={user}>
        <div data-testid='test-div'>Test Text</div>
      </PageLayout>
    )
    TestElement.propTypes = { user: PropTypes.object }

    const { getByTestId } = await renderAsync(
      wrapPageElement(TestElement, { user })
    )

    expect(getByTestId('test-div')).toBeInTheDocument()
    expect(getByTestId('page-layout-menu')).toBeInTheDocument()
  })

  describe('when logout option is clicked', () => {
    it('should call Auth0 logout function', async () => {
      const { getByTestId } = await renderAsync(
        wrapPageElement(PageLayout, { user })
      )

      const profileOption = getByTestId('menu-profile-option')
      profileOption.click()

      await waitFor(() => {
        const logoutButton = getByTestId('page-layout-menu-logout')
        logoutButton.click()
      })

      expect(logout).toHaveBeenCalledTimes(1)
    })
  })
})
