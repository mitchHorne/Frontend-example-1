import { UserThreadsContainer } from '../containers'
import PropTypes from 'prop-types'

const HomePage = ({ token }) => <UserThreadsContainer token={token} />

HomePage.propTypes = {
  token: PropTypes.string.isRequired
}

export default HomePage
