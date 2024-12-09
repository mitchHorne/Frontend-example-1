import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { login } from './utils/auth'
import { useAuth0 } from '@auth0/auth0-react'
import { prop, propOr } from 'ramda'
import { PageLayout, Spinner } from './components'

// Import pages
import {
  Home,
  Login,
  LoginCallback,
  LogoutCallback,
  Threads,
  ThreadPreview,
  Resources,
  SharedPreview
} from './pages'
import { User } from './types'

export const SecureRoute = ({
  authed,
  element: El,
  Nav = Navigate,
  ...props
}) => {
  const location = useLocation()
  const { isLoading } = useAuth0()

  const user = prop('user', authed)
  const token = prop('token', authed)

  if (isLoading) return <Spinner />

  /* Redirect them to the /logout/callback page, but save the current location they were
   * trying to go to when they were redirected. This allows us to send them
   * along to that page after they login, which is a nicer user experience
   * than dropping them off on the home page.
   */
  if (!user)
    return (
      <Nav
        to='/logout/callback'
        state={{ returnUrl: propOr('/', 'pathname', location) }}
      />
    )

  return (
    <PageLayout user={prop('user', authed)}>
      <El {...props} user={user} token={token} />
    </PageLayout>
  )
}

SecureRoute.propTypes = {
  authed: PropTypes.shape({
    user: User
  }),
  element: PropTypes.func.isRequired,
  Nav: PropTypes.func
}

const Router = () => {
  const [authed, setAuthed] = useState()
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const authUser = async () => {
      const token = await getAccessTokenSilently()
      if (!token) return setAuthed(null)

      const user = await login(token)
      if (!user) return setAuthed({ failed: true })

      setAuthed({ user, token })
    }

    if (user && isAuthenticated) authUser()
    else setAuthed(null)
  }, [user, isAuthenticated])

  return (
    <Routes>
      <Route path='/login' element={<Login authed={authed} />} />
      <Route
        path='/login/callback'
        element={<LoginCallback authed={authed} />}
      />
      <Route
        path='/logout/callback'
        element={<LogoutCallback authed={authed} />}
      />
      <Route
        path='/'
        element={<SecureRoute authed={authed} element={Home} />}
      />
      <Route
        path='/examples'
        element={<SecureRoute authed={authed} element={Threads} />}
      />
      <Route
        path='/examples/:threadId'
        element={<SecureRoute authed={authed} element={ThreadPreview} />}
      />
      <Route
        path='/threads/:threadId'
        element={<SecureRoute authed={authed} element={ThreadPreview} />}
      />
      <Route
        path='*'
        element={<SecureRoute authed={authed} element={Home} />}
      />
      <Route
        path='/resources'
        element={<SecureRoute authed={authed} element={Resources} />}
      />
      <Route path='/preview/:previewId' element={<SharedPreview />} />
    </Routes>
  )
}

export default Router
