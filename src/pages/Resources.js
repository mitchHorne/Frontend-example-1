import { ResourceContainer } from '../containers'
import PropTypes from 'prop-types'

const ResourcePage = ({ token }) => <ResourceContainer token={token} />

ResourcePage.propTypes = {
  token: PropTypes.string.isRequired
}

export default ResourcePage
