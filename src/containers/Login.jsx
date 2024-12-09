import { useAuth0 } from '@auth0/auth0-react'
import PropTypes from 'prop-types'
import { prop } from 'ramda'
import { LoginComponent } from '../components'

const LoginContainer = ({ returnUrl, authed }) => {
  const { loginWithRedirect, isLoading, user } = useAuth0()

  const authTriggered = !!(isLoading || user)
  const authFailed = prop('failed', authed)
  const handleLogin = () => loginWithRedirect({ appState: { returnUrl } })

  return (
    <LoginComponent
      authTriggered={authTriggered}
      handleLogin={handleLogin}
      authFailed={authFailed}
    />
  )
}

LoginContainer.propTypes = {
  returnUrl: PropTypes.string,
  authed: PropTypes.shape({ failed: PropTypes.bool })
}

export default LoginContainer
