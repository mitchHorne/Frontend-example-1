import { useAuth0 } from '@auth0/auth0-react'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router'
import { pathOr } from 'ramda'
import PropTypes from 'prop-types'

const LoginCallback = ({ Nav = Navigate }) => {
  const { handleRedirectCallback } = useAuth0()
  const [callbackResult, setCallbackResult] = useState(undefined)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const result = await handleRedirectCallback()
        setCallbackResult(result)
      } catch {
        setCallbackResult(null)
      }
    }

    handleCallback()
  }, [])

  if (callbackResult === undefined) return null

  return (
    <Nav to={pathOr('/', ['appState', 'returnUrl'], callbackResult)} replace />
  )
}

LoginCallback.propTypes = {
  Nav: PropTypes.func
}

export default LoginCallback
