import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  IconButton,
  QuoteTweetCard,
  TextSpan,
  TweetUserHandle,
  MediaPreview
} from '../'
import { Thread, Tweet } from '../../types'
import { prop } from 'ramda'
import { ProfilePicture } from '../shared/ProfilePicture'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  width: 100%;
`

const ClickToEdit = styled.div`
  cursor: ${({ isReadonly }) => (isReadonly ? 'default' : 'pointer')};
`

const TweetButtonBarWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 2rem;
  margin-top: 0.5rem;
  padding: 0.75em 0;

  @media screen and (max-width: 500px) {
    gap: 0;
    justify-content: space-around;
  }
`

const TweetContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  gap: 0.25rem;
  overflow-x: hidden;
`

const TweetText = styled(TextSpan)`
  min-height: 1rem;
  overflow-x: hidden;
  text-overflow: ellipsis;
  width: 100%;
  word-wrap: break-word;
`

const TweetIconButton = styled(IconButton)`
  padding: 0.75em;

  @media screen and (max-width: 500px) {
    padding: 0;
  }
`

export const TweetCard = ({
  getTweet,
  goToQuoteTweet,
  selectTweet,
  tweet,
  thread,
  isPreview,
  isReadonly
}) => {
  const { id, quoteTweetId, text, images, videos } = tweet
  const { twitterProfile } = thread

  const username = prop('username', twitterProfile)
  const name = prop('name', twitterProfile)
  const profileImageUrl = prop('profileImageUrl', twitterProfile)
  const verifiedType = prop('verifiedType', twitterProfile)

  const quoteTweet = quoteTweetId ? getTweet(quoteTweetId) : null

  return (
    <Wrapper data-testid={`tweet-card-${id}`} key={`tweet-view-card-${id}`}>
      <ProfilePicture url={profileImageUrl} />
      <TweetContent>
        <ClickToEdit
          data-testid={`tweet-card-click-to-edit-${id}`}
          isReadonly={isReadonly}
          onClick={() => {
            if (selectTweet) selectTweet(tweet)
          }}
        >
          <TweetUserHandle
            name={name}
            handle={username}
            verifiedType={verifiedType}
          />
          <TweetText>{text}</TweetText>
        </ClickToEdit>
        {!isPreview && (
          <>
            <MediaPreview media={images} />
            <MediaPreview media={videos} isVideo={true} />
          </>
        )}
        {quoteTweet && goToQuoteTweet && (
          <QuoteTweetCard
            goToQuoteTweet={goToQuoteTweet}
            handle={username}
            name={name}
            parentTweet={tweet}
            tweet={quoteTweet}
            verifiedType={verifiedType}
          />
        )}
        <TweetButtonBarWrapper>
          <TweetIconButton iconType='far' iconCode='fa-comment' noSpace />
          <TweetIconButton iconCode='fa-retweet' noSpace />
          <TweetIconButton iconType='far' iconCode='fa-heart' noSpace />
          <TweetIconButton iconCode='fa-chart-simple' noSpace />
          <TweetIconButton iconCode='fa-arrow-up-from-bracket' noSpace />
        </TweetButtonBarWrapper>
      </TweetContent>
    </Wrapper>
  )
}

TweetCard.propTypes = {
  getTweet: PropTypes.func.isRequired,
  goToQuoteTweet: PropTypes.func.isRequired,
  selectTweet: PropTypes.func,
  tweet: Tweet.isRequired,
  thread: Thread.isRequired,
  isPreview: PropTypes.bool,
  isReadonly: PropTypes.bool
}

TweetCard.defaultProps = {
  isPreview: false,
  isReadonly: false
}
