import { useEffect, useState } from 'react'
import { getExampleThreads } from '../utils/thread'
import { ThreadMenuComponent, TwitterPreview } from '../components'
import { useErrorBoundary } from 'react-error-boundary'
import { useThread } from '../hooks'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  min-height: 100vh;
  height: 100vh;
`

const ThreadMenuWrapper = styled.div`
  padding-bottom: 10rem;
  width: 100%;
  overflow-y: auto;
`

const ThreadPreviewWrapper = styled.div`
  align-items: ${({ isPreviewLoading }) =>
    isPreviewLoading ? 'center' : 'flex-start'};
  background-color: rgb(239, 243, 244);
  display: flex;
  justify-content: center;
  min-width: 600px;
  overflow-y: auto;
  padding: 2rem 0;
  position: relative;
  width: 600px;
`

const ThreadsContainer = ({ token }) => {
  const [exampleThreads, setExampleThreads] = useState(null)
  const [hoverThread, setHoverThread] = useState()

  const { showBoundary } = useErrorBoundary()

  const {
    threadDetails,
    getTweet,
    goToQuoteTweet,
    masterTweetId,
    onBackClick,
    rootDisplayTweetId
  } = useThread(hoverThread?.id, true, token, { loadedThread: hoverThread })

  const masterTweet = getTweet(masterTweetId)
  const rootDisplayTweet = getTweet(rootDisplayTweetId)

  const isPreviewLoading = hoverThread && hoverThread.id !== threadDetails?.id

  useEffect(() => {
    getExampleThreads()
      .then(result => setExampleThreads(result))
      .catch(err => {
        const error = new Error(
          `Error fetching example threads - ${err.message}`
        )
        showBoundary(error)
      })
  }, [])

  if (!exampleThreads) return null

  return (
    <Wrapper>
      <ThreadMenuWrapper>
        <ThreadMenuComponent
          threads={exampleThreads}
          heading='Example Threads'
          subHeading='Some examples to give you some inspiration and to allow you to explore how to structure different types of Scenario Threads'
          setHoverThread={setHoverThread}
        />
      </ThreadMenuWrapper>
      <ThreadPreviewWrapper isPreviewLoading={isPreviewLoading}>
        {threadDetails && !isPreviewLoading && (
          <TwitterPreview
            thread={threadDetails}
            getTweet={getTweet}
            goToQuoteTweet={goToQuoteTweet}
            masterTweet={masterTweet}
            onBackClick={onBackClick}
            rootDisplayTweet={rootDisplayTweet}
          />
        )}
      </ThreadPreviewWrapper>
    </Wrapper>
  )
}

ThreadsContainer.propTypes = {
  token: PropTypes.string.isRequired
}

export default ThreadsContainer
