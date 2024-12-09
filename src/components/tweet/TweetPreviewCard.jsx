import { format } from 'date-fns'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  IconButton,
  QuoteTweetCard,
  TextSpan,
  TweetUserHandle,
  Separator,
  MediaPreview,
  FlexRowWrapper
} from '../'
import { Thread, Tweet } from '../../types'
import { prop } from 'ramda'
import { ProfilePicture } from '../shared/ProfilePicture'

const Wrapper = styled.div`
  cursor: default;
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  width: 100%;
`

const TweetButtonBar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  width: 100%;
`

const TweetButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
`

const UserContent = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  gap: 0.5rem;
  width: 100%;
`

const TweetText = styled(TextSpan)`
  font-size: 1.25rem;
  width: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
`

const TweetInfoText = styled(TextSpan)`
  color: rgb(83, 100, 113);
  font-weight: 500;
`
const TweetBoldText = styled.strong`
  color: rgb(15, 20, 25);
`

export const TweetPreviewCard = ({
  getTweet,
  goToQuoteTweet,
  tweet,
  thread
}) => {
  const { id, quoteTweetId, text, images, videos } = tweet
  const { twitterProfile, updatedAt } = thread

  const username = prop('username', twitterProfile)
  const name = prop('name', twitterProfile)
  const profileImageUrl = prop('profileImageUrl', twitterProfile)
  const verifiedType = prop('verifiedType', twitterProfile)

  const quoteTweet = quoteTweetId ? getTweet(quoteTweetId) : null

  return (
    <Wrapper
      data-testid={`tweet-preview-card-${id}`}
      key={`tweet-preview-card-${id}`}
    >
      <UserContent>
        <ProfilePicture url={profileImageUrl} />
        <TweetUserHandle
          name={name}
          handle={username}
          verifiedType={verifiedType}
          flexDirection='column'
          gap='0'
        />
      </UserContent>
      <TweetText>{text}</TweetText>
      {quoteTweet && (
        <QuoteTweetCard
          goToQuoteTweet={goToQuoteTweet}
          handle={username}
          name={name}
          tweet={quoteTweet}
          verifiedType={verifiedType}
        />
      )}
      <MediaPreview media={images} />
      <MediaPreview media={videos} isVideo={true} />
      <TweetInfoText style={{ marginTop: '0.5rem' }}>
        {`${format(updatedAt, 'p · MMM d, yyyy')} · `}
        <TweetBoldText>1.3M</TweetBoldText>
        {' Views'}
      </TweetInfoText>
      <Separator />
      <FlexRowWrapper style={{ gap: '1rem', flexWrap: 'wrap' }}>
        <TweetInfoText>
          <TweetBoldText>1.3M</TweetBoldText>
          {' Reposts'}
        </TweetInfoText>
        <TweetInfoText>
          <TweetBoldText>850K</TweetBoldText>
          {' Quotes'}
        </TweetInfoText>
        <TweetInfoText>
          <TweetBoldText>2M</TweetBoldText>
          {' Likes'}
        </TweetInfoText>
        <TweetInfoText>
          <TweetBoldText>95K</TweetBoldText>
          {' Bookmarks'}
        </TweetInfoText>
      </FlexRowWrapper>
      <TweetButtonWrapper>
        <Separator />
        <TweetButtonBar>
          <IconButton
            size='1.25rem'
            noSpace
            iconType='far'
            iconCode='fa-comment'
          />
          <IconButton size='1.25rem' noSpace iconCode='fa-retweet' />
          <IconButton
            size='1.25rem'
            noSpace
            iconType='far'
            iconCode='fa-heart'
          />
          <IconButton
            size='1.25rem'
            noSpace
            iconType='far'
            iconCode='fa-bookmark'
          />
          <IconButton
            size='1.25rem'
            noSpace
            iconCode='fa-arrow-up-from-bracket'
          />
        </TweetButtonBar>
        <Separator />
      </TweetButtonWrapper>
    </Wrapper>
  )
}

TweetPreviewCard.propTypes = {
  getTweet: PropTypes.func.isRequired,
  goToQuoteTweet: PropTypes.func.isRequired,
  tweet: Tweet.isRequired,
  thread: Thread.isRequired
}
