import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconButton, TweetUserHandle, TextSpan, TvButton } from '../'
import { Tweet, User } from '../../types'
import { prop } from 'ramda'
import { ProfilePicture } from '../shared/ProfilePicture'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  width: 100%;
`

const AddQuoteButtonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
`

const ButtonContainer = styled.div`
  display: flex;
`

const AddButton = styled(TvButton)`
  margin-right: 1rem;
`

const TweetContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 5px;
  width: 100%;

  ${props => props.alignLeft && 'align-items: flex-start;'}

  h4 {
    margin: 5px;
  }

  p {
    margin: 5px;
  }
`

const TweetText = styled.textarea`
  border: none;
  border-bottom: 1px solid ${({ hasError }) => (hasError ? 'red' : '#ccc')};
  min-height: 3.5rem;
  resize: vertical;
  width: 100%;

  :focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? 'red' : '#1da1f2')};
  }
`

const TweetCount = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: flex-end;
`

const TextCountSpan = styled(TextSpan)`
  ${({ hasError }) => (hasError ? 'color: red' : '')};
  font-weight: 500;
`

export const AddQuoteCard = ({
  addQuoteTweet,
  setShowLinkBack,
  showLinkBack,
  showQuote,
  tweetIsQuoting,
  user,
  selectedTweet
}) => {
  const [text, setText] = useState('')

  const profileImageUrl = prop('profileImageUrl', user)
  const name = prop('name', user)
  const username = prop('username', user)
  const verifiedType = prop('verifiedType', user)

  const characterCount = text.length
  const characterCountText = `${characterCount} / 280`
  const hasError = characterCount > 280

  useEffect(() => {
    setText('')
  }, [showQuote])

  return (
    <Wrapper>
      {showLinkBack ? (
        <TweetContent alignLeft>
          <IconButton iconCode='fa-link' large noSpace />
          <h4>Link to a previous Post</h4>
          <p>Select a Post to link back to from the tree map</p>
        </TweetContent>
      ) : (
        <>
          <ProfilePicture url={profileImageUrl} />
          <TweetContent>
            <TweetUserHandle
              name={name}
              handle={username}
              verifiedType={verifiedType}
            />
            <TweetText
              id='add-quote-tweet-text-area'
              hasError={hasError}
              onChange={({ target: { value } }) => setText(value)}
              value={text}
            />
            <TweetCount>
              <TextCountSpan hasError={hasError}>
                {characterCountText}
              </TextCountSpan>
            </TweetCount>
            <AddQuoteButtonWrapper>
              <ButtonContainer>
                <IconButton iconCode='fa-image' />
                <IconButton iconCode='fa-camera' />
              </ButtonContainer>
              <ButtonContainer>
                {!tweetIsQuoting && selectedTweet.row !== 0 && (
                  <AddButton
                    id='add-quote-link-back-button'
                    data-testid='start-link-back-button'
                    onClick={e => {
                      e.stopPropagation()
                      setShowLinkBack(true)
                    }}
                  >
                    Link Back
                  </AddButton>
                )}
                <AddButton
                  id='add-quote-add-button'
                  data-testid='add-quote-button'
                  disabled={hasError}
                  onClick={e => {
                    e.stopPropagation()
                    addQuoteTweet({ text })
                  }}
                >
                  Add Quote
                </AddButton>
              </ButtonContainer>
            </AddQuoteButtonWrapper>
          </TweetContent>
        </>
      )}
    </Wrapper>
  )
}

AddQuoteCard.propTypes = {
  addQuoteTweet: PropTypes.func.isRequired,
  setShowLinkBack: PropTypes.func.isRequired,
  showQuote: PropTypes.bool.isRequired,
  tweetIsQuoting: PropTypes.bool.isRequired,
  user: User.isRequired,
  selectedTweet: Tweet.isRequired,
  showLinkBack: PropTypes.bool
}
