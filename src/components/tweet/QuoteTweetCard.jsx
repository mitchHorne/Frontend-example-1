import { prop } from 'ramda'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextSpan, TweetUserHandle } from '../'
import { Tweet } from '../../types'
import { CloseButton } from '../modal/shared'

const QuoteTweetWrapper = styled.div`
  border-radius: 16px;
  border: 1px solid rgb(220, 220, 220);
  cursor: pointer;
  display: flex;
  flex-flow: column nowrap;
  gap: 0.1rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  position: relative;

  :hover {
    background-color: rgb(245, 245, 245);
  }
`

const TweetText = styled(TextSpan)`
  flex: 1;
  overflow-x: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
`

export const QuoteTweetCard = ({
  goToQuoteTweet,
  handle,
  isSelected,
  name,
  parentTweet,
  removeLinkBackTweet,
  tweet,
  verifiedType
}) => (
  <QuoteTweetWrapper
    id={`quote-tweet-card-${tweet.row}-${tweet.col}`}
    data-testid={`quote-tweet-card-${tweet.row}-${tweet.col}`}
    onClick={e => {
      e.stopPropagation()
      goToQuoteTweet(tweet)
    }}
  >
    {isSelected && parentTweet.isQuoteBack && (
      <CloseButton
        style={{ top: '0.5rem', right: '0.5rem', fontSize: '15px' }}
        icon={['fas', 'fa-x']}
        onClick={removeLinkBackTweet}
      />
    )}
    <TweetUserHandle name={name} handle={handle} verifiedType={verifiedType} />
    <TweetText>{prop('text', tweet)}</TweetText>
  </QuoteTweetWrapper>
)

QuoteTweetCard.propTypes = {
  goToQuoteTweet: PropTypes.func.isRequired,
  handle: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  name: PropTypes.string.isRequired,
  parentTweet: Tweet,
  removeLinkBackTweet: PropTypes.func,
  tweet: Tweet.isRequired,
  verifiedType: PropTypes.string
}

QuoteTweetCard.defaultProps = {
  isSelected: false
}
