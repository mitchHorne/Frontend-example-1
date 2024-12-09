import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  TextSpan,
  TweetReplyThread,
  TweetPreviewCard,
  FlexRowWrapper,
  IconButton
} from '../'
import { Thread, Tweet } from '../../types'

const TweetsWrapper = styled.div`
  align-items: flex-start;
  background-color: white;
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.3);
  display: flex;
  flex-flow: column nowrap;
  min-width: 500px;
  overflow-y: auto;
  padding: 1rem;
  position: relative;
  scrollbar-width: none;
  width: 500px;

  @media screen and (max-width: 530px) {
    border-radius: 0;
    min-width: auto;
    width: 100%;
  }
`

const BackBar = styled(FlexRowWrapper)`
  gap: 1rem;
  margin-bottom: 0.5rem;
`

export const TwitterPreview = ({
  thread,
  getTweet,
  goToQuoteTweet,
  masterTweet,
  onBackClick,
  rootDisplayTweet
}) => {
  const previewThread = { ...thread, finalizedAt: 1 }
  const firstReplyId = rootDisplayTweet?.replyId
  const firstReply = firstReplyId ? getTweet(firstReplyId) : null
  const hasQuoteParent = rootDisplayTweet?.quoteParentId

  return (
    <TweetsWrapper scrollable={true}>
      <BackBar>
        <IconButton
          data-testid='thread-back-button'
          iconCode='fa-arrow-left'
          onClick={onBackClick}
          isDisabled={!hasQuoteParent}
        />
        <TextSpan style={{ fontSize: '20px', padding: '0' }}>
          <strong>Post</strong>
        </TextSpan>
      </BackBar>
      {rootDisplayTweet && (
        <TweetPreviewCard
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          thread={previewThread}
          tweet={rootDisplayTweet}
        />
      )}
      {firstReply && (
        <TweetReplyThread
          thread={previewThread}
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          masterTweet={masterTweet}
          onBackClick={onBackClick}
          rootDisplayTweet={rootDisplayTweet}
          tweet={firstReply}
        />
      )}
    </TweetsWrapper>
  )
}

TwitterPreview.propTypes = {
  thread: Thread.isRequired,
  getTweet: PropTypes.func.isRequired,
  goToQuoteTweet: PropTypes.func.isRequired,
  masterTweet: Tweet.isRequired,
  onBackClick: PropTypes.func.isRequired,
  rootDisplayTweet: Tweet.isRequired
}
