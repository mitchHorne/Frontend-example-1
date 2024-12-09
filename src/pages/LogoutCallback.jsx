import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

const LogoutCallback = ({ Nav = Navigate }) => {
  const { state } = useLocation()

  return <Nav to='/login' state={state} replace />
}

LogoutCallback.propTypes = {
  Nav: PropTypes.func
}

export default LogoutCallback
