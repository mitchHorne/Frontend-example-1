import PropTypes from 'prop-types'
import { TweetCard, TweetEditCard } from '../'
import { Thread, Tweet } from '../../types'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
`

export const TweetReplyThread = ({
  addTweet,
  editComponentRef,
  editTweetText,
  getTweet,
  goToQuoteTweet,
  masterTweet,
  onMediaRemove,
  removeLinkBackTweet,
  selectedTweet,
  selectTweet,
  setShowDelete,
  setShowQuote,
  showDelete,
  setMediaUploadType,
  thread,
  tweet,
  editTweetCardUri
}) => {
  const { finalizedAt } = thread
  const isReadonly = !!finalizedAt

  const replyTweet = tweet.replyId ? getTweet(tweet.replyId) : null
  const isSelected = selectedTweet && selectedTweet.id === tweet.id

  return (
    <Wrapper key={`tweet-reply-thread-${tweet.id}`}>
      {(!isSelected || isReadonly) && (
        <TweetCard
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          selectTweet={selectTweet}
          tweet={tweet}
          thread={thread}
          isReadonly={isReadonly}
        />
      )}
      {isSelected && !isReadonly && (
        <TweetEditCard
          addTweet={addTweet}
          editComponentRef={editComponentRef}
          editTweetText={editTweetText}
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          hasQuote={!!tweet.quoteTweetId}
          hasText={!!tweet.text}
          masterTweet={masterTweet}
          onMediaRemove={onMediaRemove}
          removeLinkBackTweet={removeLinkBackTweet}
          selectTweet={selectTweet}
          setShowDelete={setShowDelete}
          showDelete={showDelete}
          setMediaUploadType={setMediaUploadType}
          setShowQuote={setShowQuote}
          thread={thread}
          tweet={tweet}
          editTweetCardUri={editTweetCardUri}
        />
      )}
      {replyTweet && (
        <TweetReplyThread
          addTweet={addTweet}
          editComponentRef={editComponentRef}
          editTweetText={editTweetText}
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          masterTweet={masterTweet}
          onMediaRemove={onMediaRemove}
          removeLinkBackTweet={removeLinkBackTweet}
          selectedTweet={selectedTweet}
          selectTweet={selectTweet}
          setShowDelete={setShowDelete}
          setShowQuote={setShowQuote}
          showDelete={showDelete}
          setMediaUploadType={setMediaUploadType}
          thread={thread}
          tweet={replyTweet}
          editTweetCardUri={editTweetCardUri}
        />
      )}
    </Wrapper>
  )
}

TweetReplyThread.propTypes = {
  addTweet: PropTypes.func,
  editComponentRef: PropTypes.object,
  editTweetText: PropTypes.func,
  getTweet: PropTypes.func.isRequired,
  goToQuoteTweet: PropTypes.func.isRequired,
  editTweetCardUri: PropTypes.func.isRequired,
  masterTweet: Tweet.isRequired,
  removeLinkBackTweet: PropTypes.func,
  selectedTweet: Tweet,
  selectTweet: PropTypes.func,
  setShowDelete: PropTypes.func,
  setShowQuote: PropTypes.func,
  showDelete: PropTypes.bool,
  onMediaRemove: PropTypes.func,
  setMediaUploadType: PropTypes.func,
  tweet: Tweet.isRequired,
  thread: Thread.isRequired
}
