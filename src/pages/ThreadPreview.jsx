import { includes } from 'ramda'
import { useLocation, useParams } from 'react-router'
import { ThreadPreviewContainer } from '../containers'
import PropTypes from 'prop-types'
import { User } from '../types'

const ThreadPreviewPage = ({ token, user }) => {
  const { threadId } = useParams()
  const { pathname } = useLocation()
  const isExample = includes('examples', pathname)

  return (
    <ThreadPreviewContainer
      threadId={threadId}
      isExample={isExample}
      token={token}
      user={user}
    />
  )
}

ThreadPreviewPage.propTypes = {
  token: PropTypes.string.isRequired,
  user: User.isRequired
}

export default ThreadPreviewPage
