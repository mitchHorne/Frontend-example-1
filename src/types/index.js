import PropTypes from 'prop-types'

export const Tweet = PropTypes.shape({
  id: PropTypes.string.isRequired,
  images: PropTypes.array,
  quoteParentId: PropTypes.string,
  quoteTweetId: PropTypes.string,
  replyId: PropTypes.string,
  replyToId: PropTypes.string,
  text: PropTypes.string.isRequired,
  videos: PropTypes.array
})

export const User = PropTypes.shape({
  id: PropTypes.string,
  picture: PropTypes.string,
  name: PropTypes.string,
  nickname: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'client']))
})

export const Thread = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  twitterProfile: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    id: PropTypes.string,
    verified: PropTypes.bool,
    profileImageUrl: PropTypes.string,
    verifiedType: PropTypes.string
  }),
  twitterId: PropTypes.string,
  createdAt: PropTypes.number,
  createdBy: PropTypes.string,
  updatedAt: PropTypes.number,
  updatedBy: PropTypes.string,
  finalizedAt: PropTypes.number,
  finalizedBy: PropTypes.string
})
