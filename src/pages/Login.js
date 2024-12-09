import { useLocation, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { LoginContainer } from '../containers'
import { propOr } from 'ramda'
import { User } from '../types'

const LoginPage = ({ authed, Nav = Navigate }) => {
  const { state } = useLocation()
  const returnUrl = propOr('/', 'returnUrl', state)

  // Send them back to the page they tried to visit when they were
  // redirected to the login page. Use { replace: true } so we don't create
  // another entry in the history stack for the login page.  This means that
  // when they get to the protected page and click the back button, they
  // won't end up back on the login page, which is also really nice for the
  // user experience.
  if (authed?.user) return <Nav to={returnUrl} replace />

  return <LoginContainer returnUrl={returnUrl} authed={authed} />
}

LoginPage.propTypes = {
  authed: PropTypes.shape({
    user: User
  }),
  Nav: PropTypes.func
}

export default LoginPage
