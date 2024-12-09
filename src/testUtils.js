import { act, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

/* Since some of the pages use router specific functions,
 * we need to wrap it in a router as it would be in production.
 */
export const wrapPageElement = (Page, props) => (
  <BrowserRouter>
    <ErrorBoundary FallbackComponent={TestErrorFallback}>
      <Page {...props} />
    </ErrorBoundary>
  </BrowserRouter>
)

export const renderAsync = async children => {
  let renderResult
  await act(async () => {
    renderResult = render(children)
  })

  return renderResult
}

export const TestErrorFallback = ({ error }) => {
  useEffect(() => {
    throw error
  }, [error])

  return null
}

TestErrorFallback.propTypes = {
  error: PropTypes.object
}
