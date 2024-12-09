import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  AddQuoteCard,
  DeleteModal,
  IconButton,
  QuoteModal,
  Separator,
  TextSpan,
  TitleBar,
  TweetReplyThread
} from '../'
import { Thread, Tweet, User } from '../../types'
import { THREAD_FINALIZED_SUB_HEADING } from '../../constants'
import { useEffect, useRef } from 'react'
import { map } from 'ramda'
import { getTweetBreadcrumbs } from '../../utils/thread'

const TweetsWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-basis: 1;
  flex-flow: column nowrap;
  gap: 0.5rem;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: ${({ scrollable }) => (scrollable ? 'auto' : 'hidden')};
  padding: 1rem 1rem 10rem;
  position: relative;
  scrollbar-width: none;
  width: 100%;
`

const BreadCrumbWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  gap: 0.5rem;
`

const BreadCrumbsContainer = styled(BreadCrumbWrapper)`
  flex-flow: row wrap;
  width: 100%;
`

const TweetTextPreview = styled(TextSpan)`
  overflow: hidden;
  padding: 0;
  padding: 0.75em 0;
  white-space: nowrap;
`

const FinalizeErrorLink = styled(TweetTextPreview)`
  color: rgb(83, 100, 113);
  cursor: pointer;

  :hover {
    text-decoration: underline;
    color: #1da1f2;
  }
`

const BreadCrumbItem = styled(TweetTextPreview)`
  color: rgb(83, 100, 113);
  cursor: pointer;
  max-width: 5rem;
  text-overflow: ellipsis;

  :hover {
    text-decoration: underline;
    color: #1da1f2;
  }
`

const BreadCrumbSeparator = styled(TweetTextPreview)`
  color: rgb(83, 100, 113);
  min-width: 1rem;
  width: 1rem;
  display: flex;
  justify-content: center;
`

const CurrentTweetText = styled(TweetTextPreview)`
  color: #1da1f2;
  text-overflow: ellipsis;
  max-width: 5rem;
`

const FinalizeErrorLinkWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`

export const ThreadComponent = ({
  addQuoteProps,
  addTweet,
  editTweetText,
  getTweet,
  goToQuoteTweet,
  handleDelete,
  masterTweet,
  onBackClick,
  rootDisplayTweet,
  selectedTweet,
  selectTweet,
  setShowDelete,
  setShowQuote,
  showDelete,
  thread,
  getBackRootDisplayTweet,
  onFinalizeThread,
  setMediaUploadType,
  onMediaRemove,
  removeLinkBackTweet,
  isUserAdmin,
  showFinalizeErrors,
  finalizeErrors,
  editTweetCardUri
}) => {
  const thisRef = useRef(null)
  const editComponentRef = useRef(null)
  const isFinalized = !!thread.finalizedAt

  const { showQuote } = addQuoteProps

  const breadcrumbs = getTweetBreadcrumbs(
    rootDisplayTweet,
    getBackRootDisplayTweet,
    getTweet
  )

  useEffect(() => {
    const element = thisRef?.current
    if (element && (showQuote || showDelete))
      element.scrollTo({
        top: 0,
        left: 0
      })
  }, [showQuote, showDelete])

  useEffect(() => {
    const element = editComponentRef?.current
    if (element && !showQuote) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedTweet, editComponentRef, showQuote])

  return (
    <TweetsWrapper ref={thisRef} scrollable={!showQuote && !showDelete}>
      <QuoteModal
        heading='Quote Post'
        Body={AddQuoteCard}
        close={() => {
          setShowQuote(false)
          addQuoteProps.setShowLinkBack(false)
        }}
        show={addQuoteProps.showQuote}
        selectedTweet={selectedTweet}
        {...addQuoteProps}
      />

      <DeleteModal
        close={() => {
          setShowDelete(false)
        }}
        confirm={handleDelete}
        heading='Delete Post'
        show={showDelete}
      />

      <TitleBar
        buttonAction={onFinalizeThread}
        buttonText={isFinalized ? 'Unlock' : 'Finalise'}
        buttonHidden={!(!isFinalized || isUserAdmin)}
        heading={thread.name}
        headingIcon={thread.finalizedAt ? 'fa-lock' : null}
        subHeading={thread.finalizedAt ? THREAD_FINALIZED_SUB_HEADING : null}
      />
      {!!finalizeErrors?.length && (
        <FinalizeErrorLinkWrapper>
          <FinalizeErrorLink onClick={showFinalizeErrors}>
            Show previous errors...
          </FinalizeErrorLink>
        </FinalizeErrorLinkWrapper>
      )}
      <BreadCrumbsContainer id='thread-breadcrumbs-container'>
        {!!breadcrumbs?.length && (
          <>
            <IconButton
              data-testid='thread-back-button'
              iconCode='fa-arrow-left'
              onClick={onBackClick}
            />
            {map(
              tweet => (
                <BreadCrumbWrapper key={`bread-crumb-item-${tweet.id}`}>
                  <BreadCrumbItem onClick={() => selectTweet(tweet)}>
                    {tweet.text}
                  </BreadCrumbItem>
                  <BreadCrumbSeparator>{'>'}</BreadCrumbSeparator>
                </BreadCrumbWrapper>
              ),
              breadcrumbs
            )}
          </>
        )}
        <CurrentTweetText>{rootDisplayTweet.text}</CurrentTweetText>
      </BreadCrumbsContainer>
      <Separator />
      {rootDisplayTweet && (
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
          setMediaUploadType={setMediaUploadType}
          setShowQuote={setShowQuote}
          showDelete={showDelete}
          thread={thread}
          tweet={rootDisplayTweet}
          editTweetCardUri={editTweetCardUri}
        />
      )}
    </TweetsWrapper>
  )
}

ThreadComponent.propTypes = {
  addQuoteProps: PropTypes.shape({
    addQuoteTweet: PropTypes.func.isRequired,
    setShowLinkBack: PropTypes.func.isRequired,
    showLinkBack: PropTypes.bool.isRequired,
    showQuote: PropTypes.bool.isRequired,
    tweetIsQuoting: PropTypes.bool.isRequired,
    user: User.isRequired
  }).isRequired,
  addTweet: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  editTweetText: PropTypes.func.isRequired,
  getTweet: PropTypes.func.isRequired,
  goToQuoteTweet: PropTypes.func.isRequired,
  masterTweet: Tweet.isRequired,
  onBackClick: PropTypes.func.isRequired,
  rootDisplayTweet: Tweet.isRequired,
  selectTweet: PropTypes.func.isRequired,
  getBackRootDisplayTweet: PropTypes.func.isRequired,
  onFinalizeThread: PropTypes.func.isRequired,
  removeLinkBackTweet: PropTypes.func.isRequired,
  selectedTweet: Tweet.isRequired,
  setShowQuote: PropTypes.func.isRequired,
  setShowDelete: PropTypes.func.isRequired,
  showDelete: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  onMediaRemove: PropTypes.func.isRequired,
  setMediaUploadType: PropTypes.func.isRequired,
  thread: Thread.isRequired,
  showFinalizeErrors: PropTypes.func.isRequired,
  editTweetCardUri: PropTypes.func.isRequired,
  finalizeErrors: PropTypes.arrayOf(PropTypes.object).isRequired
}
