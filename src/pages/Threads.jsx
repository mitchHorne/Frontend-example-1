import { ThreadsContainer } from '../containers'
import PropTypes from 'prop-types'

const ThreadsPage = ({ token }) => <ThreadsContainer token={token} />

ThreadsPage.propTypes = {
  token: PropTypes.string.isRequired
}

export default ThreadsPage
