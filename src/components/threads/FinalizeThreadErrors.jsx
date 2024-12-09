import styled from 'styled-components'
import PropTypes from 'prop-types'
import { TweetCard } from '../tweet'
import { Thread } from '../../types'
import { Separator } from '../shared'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  max-height: 80vh;
  overflow-y: auto;
  gap: 1rem;
`
export const ErrorSpan = styled.span`
  color: red;
  font-size: 12px;
  padding-left: 0.5rem;
  padding-left: 3rem;
`

export const FinalizeThreadErrors = ({
  onCloseModal,
  finalizeErrors,
  getTweet,
  selectTweet,
  thread,
  setFinalizeErrors
}) => {
  const onErrorClick = tweet => {
    selectTweet(tweet)
    setFinalizeErrors(prevErrors =>
      prevErrors.filter(({ nodeId }) => nodeId !== tweet.id)
    )
    onCloseModal()
  }

  return (
    <Wrapper
      id='finalize-thread-errors-body'
      data-testid='finalize-thread-errors-body'
    >
      {finalizeErrors.map(({ nodeId, errors }) => (
        <div key={nodeId}>
          <TweetCard
            getTweet={getTweet}
            selectTweet={onErrorClick}
            tweet={getTweet(nodeId)}
            thread={thread}
            isPreview={false}
            isReadonly={false}
          ></TweetCard>
          <ErrorSpan>The Post {errors[0].message}</ErrorSpan>
          <Separator />
        </div>
      ))}
    </Wrapper>
  )
}

FinalizeThreadErrors.propTypes = {
  finalizeErrors: PropTypes.arrayOf(
    PropTypes.shape({
      nodeId: PropTypes.string.isRequired,
      errors: PropTypes.arrayOf(
        PropTypes.shape({
          message: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  getTweet: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  selectTweet: PropTypes.func.isRequired,
  thread: Thread.isRequired,
  setFinalizeErrors: PropTypes.func.isRequired
}
