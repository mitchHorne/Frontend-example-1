import PropTypes from 'prop-types'
import { curryN, includes, match, prop, trim } from 'ramda'
import styled from 'styled-components'
import {
  IconButton,
  QuoteTweetCard,
  TweetUserHandle,
  TvButton,
  MediaPreview,
  TextSpan,
  Modal,
  FormInput
} from '../'
import { Thread, Tweet } from '../../types'
import debounce from 'lodash.debounce'
import { useState } from 'react'
import { ProfilePicture } from '../shared/ProfilePicture'
import { useMemo } from 'react'
import { CardUriEdit } from './CardUriEdit'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 10px;
  width: 100%;

  box-shadow: 0px 0px 1rem rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
`

const TweetEditButtonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 0rem;
`

const TweetAddButton = styled(TvButton)`
  margin-right: 1rem;
`

const TweetContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  gap: 5px;
  overflow-x: hidden;
`

const TweetCount = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: flex-end;
`

const TweetEditText = styled.textarea`
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

const TextCountSpan = styled(TextSpan)`
  ${({ hasError }) => (hasError ? 'color: red' : '')};
  font-weight: 500;
`

export const TweetEditCard = ({
  addTweet,
  editComponentRef,
  editTweetText,
  getTweet,
  goToQuoteTweet,
  hasQuote,
  hasText,
  masterTweet,
  removeLinkBackTweet,
  selectTweet,
  setShowDelete,
  setShowQuote,
  setMediaUploadType,
  tweet,
  thread,
  onMediaRemove,
  editTweetCardUri
}) => {
  const { id, quoteTweetId, replyId, text, images, videos, row, col, cardUri } =
    tweet
  const { twitterProfile } = thread

  const username = prop('username', twitterProfile)
  const name = prop('name', twitterProfile)
  const profileImageUrl = prop('profileImageUrl', twitterProfile)
  const verifiedType = prop('verifiedType', twitterProfile)

  const [tweetInput, setTweetInput] = useState(text)
  const [showCardUriModal, setShowCardUriModal] = useState(false)
  const [tempCardUri, setTempCardUri] = useState('')

  const cardUriError = useMemo(() => {
    if (!tempCardUri) return 'Card URI is required'

    if (includes(' ', tempCardUri)) return 'Card URI cannot contain spaces'

    // Regex: https://regexr.com/85rll
    if (!match(/^card:\/\/\d+$/, tempCardUri).length)
      return 'Card URI must be in the format "card://<Number ID>" (eg. card://123456)'

    return ''
  }, [tempCardUri])

  const videosCount = videos.length
  const mediaCount = videosCount + images.length

  const quoteTweet = quoteTweetId ? getTweet(quoteTweetId) : null

  const characterCount = tweetInput.length
  const characterCountText = `${characterCount} / 280`
  const hasError = characterCount > 280

  const handleEditText = (id, tweet) =>
    debounce(e => {
      editTweetText(id, tweet, e.target.value)
    }, 500)

  const handleUserInput = value => {
    setTweetInput(value)
  }

  const onRemove = curryN(2, (isVideo, mediaUrl) =>
    onMediaRemove(id, isVideo, mediaUrl)
  )

  return (
    <Wrapper
      data-testid={`tweet-edit-card-${id}`}
      onClick={() => selectTweet(tweet)}
      ref={editComponentRef}
      key={`tweet-edit-card-${id}`}
    >
      {showCardUriModal && (
        <Modal
          Body={CardUriEdit}
          close={() => setShowCardUriModal(false)}
          show={showCardUriModal}
          heading={`Edit Card URI`}
          onCloseModal={() => {
            setShowCardUriModal(false)
            setTempCardUri('')
          }}
          onConfirm={() => {
            setShowCardUriModal(false)
            editTweetCardUri(id, tweet, tempCardUri)
            setTempCardUri('')
          }}
          onChange={value => setTempCardUri(trim(value))}
          error={cardUriError}
          size={60}
        />
      )}
      <ProfilePicture url={profileImageUrl} />
      <TweetContent>
        <TweetUserHandle
          name={name}
          handle={username}
          verifiedType={verifiedType}
        />
        <TweetEditText
          id={`tweet-edit-text-area-${row}-${col}`}
          data-testid={`tweet-edit-text-area`}
          hasError={hasError}
          onChange={e => {
            handleEditText(id, tweet)(e)
            handleUserInput(e.target.value)
          }}
          defaultValue={text}
        />
        <TweetCount>
          <TextCountSpan hasError={hasError}>
            {characterCountText}
          </TextCountSpan>
        </TweetCount>

        <MediaPreview media={images} onRemove={onRemove(false)} />
        <MediaPreview media={videos} isVideo={true} onRemove={onRemove(true)} />
        {!!cardUri && (
          <div
            style={{
              display: 'flex',
              flexFlow: 'row nowrap',
              gap: '0.5rem',
              alignItems: 'center',
              paddingRight: '1rem',
              margin: '0.5rem 0'
            }}
          >
            <TextSpan style={{ padding: '0', textWrap: 'nowrap' }}>
              <strong>Card URI:</strong>
            </TextSpan>
            <FormInput
              style={{ backgroundColor: 'lightgray' }}
              value={cardUri}
              disabled
            />
            <IconButton
              iconCode='x'
              onClick={() => editTweetCardUri(id, tweet, null)}
              noSpace
            />
          </div>
        )}

        {quoteTweet && (
          <QuoteTweetCard
            goToQuoteTweet={goToQuoteTweet}
            handle={username}
            name={name}
            tweet={quoteTweet}
            parentTweet={tweet}
            isSelected={true}
            removeLinkBackTweet={removeLinkBackTweet}
            verifiedType={verifiedType}
          />
        )}
        <TweetEditButtonWrapper>
          <ButtonContainer>
            <IconButton
              onClick={() => setMediaUploadType('image')}
              iconCode='fa-image'
              isDisabled={cardUri || mediaCount >= 4}
            />
            <IconButton
              onClick={() => setMediaUploadType('video')}
              iconCode='fa-video'
              isDisabled={cardUri || videosCount >= 1 || mediaCount >= 4}
            />
            <IconButton
              onClick={() => setMediaUploadType('gif')}
              isDisabled={cardUri || videosCount >= 1 || mediaCount >= 4}
              buttonText='gif'
            />
            <IconButton
              onClick={() => setShowCardUriModal(true)}
              isDisabled={cardUri || mediaCount > 0}
              iconCode='link'
            />
          </ButtonContainer>
          <ButtonContainer>
            {hasText && (
              <>
                {!hasQuote && (
                  <TweetAddButton
                    id='tweet-edit-add-quote-button'
                    data-testid='add-quote-button'
                    onClick={e => {
                      e.stopPropagation()
                      setShowQuote(true)
                    }}
                  >
                    Add Quote
                  </TweetAddButton>
                )}
                <TweetAddButton
                  id='tweet-edit-add-tweet-button'
                  data-testid='add-tweet-button'
                  onClick={e => {
                    e.stopPropagation()
                    addTweet(tweet, replyId)
                  }}
                >
                  Add Reply
                </TweetAddButton>
              </>
            )}
            {masterTweet.id !== id && (
              <IconButton
                data-testid='delete-tweet-button'
                iconCode='fa-trash'
                onClick={e => {
                  e.stopPropagation()
                  setShowDelete(true)
                }}
                hoverColor='red'
              />
            )}
          </ButtonContainer>
        </TweetEditButtonWrapper>
      </TweetContent>
    </Wrapper>
  )
}

TweetEditCard.propTypes = {
  addTweet: PropTypes.func.isRequired,
  editComponentRef: PropTypes.object.isRequired,
  editTweetText: PropTypes.func.isRequired,
  editTweetCardUri: PropTypes.func.isRequired,
  getTweet: PropTypes.func.isRequired,
  goToQuoteTweet: PropTypes.func.isRequired,
  hasQuote: PropTypes.bool.isRequired,
  hasText: PropTypes.bool.isRequired,
  masterTweet: Tweet.isRequired,
  removeLinkBackTweet: PropTypes.func.isRequired,
  selectTweet: PropTypes.func.isRequired,
  setShowDelete: PropTypes.func.isRequired,
  setShowQuote: PropTypes.func.isRequired,
  onMediaRemove: PropTypes.func.isRequired,
  setMediaUploadType: PropTypes.func.isRequired,
  tweet: Tweet.isRequired,
  thread: Thread.isRequired
}
