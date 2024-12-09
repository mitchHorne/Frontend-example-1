import { ErrorBoundary } from 'react-error-boundary'
import { Home } from '../../pages/'
import { renderAsync, wrapPageElement } from '../../testUtils'

describe('Home', () => {
  const HomeElement = props => (
    <ErrorBoundary
      FallbackComponent={({ error }) => {
        console.error('Error Fallback', { error })
        return <div id='mock-error-fallback'></div>
      }}
    >
      <Home {...props} />
    </ErrorBoundary>
  )

  it('renders without crashing', async () => {
    await renderAsync(wrapPageElement(HomeElement, { token: 'some-token' }))
  })
})
