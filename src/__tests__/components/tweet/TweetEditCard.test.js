import { fireEvent, render, waitFor } from '@testing-library/react'
import { TweetEditCard } from '../../../components'

describe('TweetEditCard', () => {
  const tweet = {
    id: 'post_id',
    quoteTweetId: null,
    replyId: null,
    text: 'post text',
    images: [],
    videos: [],
    row: 0,
    col: 0
  }

  it('should render without crashing', () => {
    const { container } = render(
      <TweetEditCard
        addTweet={() => {}}
        editTweetText={() => {}}
        getTweet={() => {}}
        goToQuoteTweet={() => {}}
        removeLinkBackTweet={() => {}}
        selectTweet={() => {}}
        setShowDelete={() => {}}
        setShowQuote={() => {}}
        onMediaRemove={() => {}}
        setMediaUploadType={() => {}}
        hasQuote={false}
        hasText={false}
        masterTweet={tweet}
        tweet={tweet}
        thread={{}}
      />
    )

    expect(container.children.length).toEqual(1)
  })

  it('should contain user name and handle', () => {
    const name = 'user name'
    const username = 'userHandle'

    const thread = { twitterProfile: { name, username } }

    const { getByText } = render(
      <TweetEditCard
        addTweet={() => {}}
        editTweetText={() => {}}
        getTweet={() => {}}
        goToQuoteTweet={() => {}}
        removeLinkBackTweet={() => {}}
        selectTweet={() => {}}
        setShowDelete={() => {}}
        setShowQuote={() => {}}
        onMediaRemove={() => {}}
        setMediaUploadType={() => {}}
        hasQuote={false}
        hasText={false}
        masterTweet={tweet}
        tweet={tweet}
        thread={thread}
      />
    )

    expect(getByText(name)).toBeInTheDocument()
    expect(getByText(`@${username}`)).toBeInTheDocument()
  })

  it('should contain the post text length', () => {
    const { getByText } = render(
      <TweetEditCard
        addTweet={() => {}}
        editTweetText={() => {}}
        getTweet={() => {}}
        goToQuoteTweet={() => {}}
        removeLinkBackTweet={() => {}}
        selectTweet={() => {}}
        setShowDelete={() => {}}
        setShowQuote={() => {}}
        onMediaRemove={() => {}}
        setMediaUploadType={() => {}}
        hasQuote={false}
        hasText={false}
        masterTweet={tweet}
        tweet={tweet}
        thread={{}}
      />
    )

    expect(getByText(`${tweet.text.length} / 280`)).toBeInTheDocument()
  })

  describe('when Post text is edited', () => {
    it('should call editTweetText after 500ms', async () => {
      const editTweetText = jest.fn()

      const { getByTestId } = render(
        <TweetEditCard
          addTweet={() => {}}
          editTweetText={editTweetText}
          getTweet={() => {}}
          goToQuoteTweet={() => {}}
          removeLinkBackTweet={() => {}}
          selectTweet={() => {}}
          setShowDelete={() => {}}
          setShowQuote={() => {}}
          onMediaRemove={() => {}}
          setMediaUploadType={() => {}}
          hasQuote={false}
          hasText={false}
          masterTweet={tweet}
          tweet={tweet}
          thread={{}}
        />
      )

      const textArea = getByTestId('tweet-edit-text-area')
      fireEvent.change(textArea, { target: { value: 'new text' } })

      await waitFor(() => {
        expect(editTweetText).toHaveBeenCalledTimes(1)
        expect(editTweetText).toHaveBeenCalledWith('post_id', tweet, 'new text')
      })
    })
  })

  describe('when Add Quote button is clicked', () => {
    it('should call setShowQuote', () => {
      const setShowQuote = jest.fn()

      const { getByTestId } = render(
        <TweetEditCard
          addTweet={() => {}}
          editTweetText={() => {}}
          getTweet={() => {}}
          goToQuoteTweet={() => {}}
          removeLinkBackTweet={() => {}}
          selectTweet={() => {}}
          setShowDelete={() => {}}
          setShowQuote={setShowQuote}
          onMediaRemove={() => {}}
          setMediaUploadType={() => {}}
          hasQuote={false}
          hasText={true}
          masterTweet={tweet}
          tweet={tweet}
          thread={{}}
        />
      )

      const quoteButton = getByTestId('add-quote-button')
      quoteButton.click()

      expect(setShowQuote).toHaveBeenCalledTimes(1)
      expect(setShowQuote).toHaveBeenCalledWith(true)
    })
  })

  describe('when Add Reply button is clicked', () => {
    it('should call addTweet', () => {
      const addTweet = jest.fn()

      const { getByTestId } = render(
        <TweetEditCard
          addTweet={addTweet}
          editTweetText={() => {}}
          getTweet={() => {}}
          goToQuoteTweet={() => {}}
          removeLinkBackTweet={() => {}}
          selectTweet={() => {}}
          setShowDelete={() => {}}
          setShowQuote={() => {}}
          onMediaRemove={() => {}}
          setMediaUploadType={() => {}}
          hasQuote={false}
          hasText={true}
          masterTweet={tweet}
          tweet={tweet}
          thread={{}}
        />
      )

      const replyButton = getByTestId('add-tweet-button')
      replyButton.click()

      expect(addTweet).toHaveBeenCalledTimes(1)
      expect(addTweet).toHaveBeenCalledWith(tweet, null)
    })
  })

  describe('when Delete button is clicked', () => {
    it('should call addTweet', () => {
      const setShowDelete = jest.fn()

      const replyTweet = { ...tweet, row: 1, id: 'reply_id' }
      const masterTweet = {
        ...tweet,
        text: 'master tweet text',
        replyId: replyTweet.id
      }

      const { getByTestId } = render(
        <TweetEditCard
          addTweet={() => {}}
          editTweetText={() => {}}
          getTweet={() => {}}
          goToQuoteTweet={() => {}}
          removeLinkBackTweet={() => {}}
          selectTweet={() => {}}
          setShowDelete={setShowDelete}
          setShowQuote={() => {}}
          onMediaRemove={() => {}}
          setMediaUploadType={() => {}}
          hasQuote={false}
          hasText={true}
          masterTweet={masterTweet}
          tweet={replyTweet}
          thread={{}}
        />
      )

      const deleteButton = getByTestId('delete-tweet-button')
      deleteButton.click()

      expect(setShowDelete).toHaveBeenCalledTimes(1)
      expect(setShowDelete).toHaveBeenCalledWith(true)
    })
  })

  describe('when clicking on quote', () => {
    it('should call goToQuoteTweet', () => {
      const getTweet = jest.fn()
      const goToQuoteTweet = jest.fn()

      const quoteTweet = { ...tweet, col: 1, id: 'quote_id' }
      const masterTweet = {
        ...tweet,
        text: 'master tweet text',
        quoteTweetId: quoteTweet.id
      }

      getTweet.mockReturnValue(quoteTweet)

      const { getByTestId } = render(
        <TweetEditCard
          addTweet={() => {}}
          editTweetText={() => {}}
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          removeLinkBackTweet={() => {}}
          selectTweet={() => {}}
          setShowDelete={() => {}}
          setShowQuote={() => {}}
          onMediaRemove={() => {}}
          setMediaUploadType={() => {}}
          hasQuote={true}
          hasText={true}
          masterTweet={masterTweet}
          tweet={masterTweet}
          thread={{}}
        />
      )

      const quoteCard = getByTestId('quote-tweet-card-0-1')
      expect(quoteCard).toBeInTheDocument()

      quoteCard.click()

      expect(goToQuoteTweet).toHaveBeenCalledTimes(1)
      expect(goToQuoteTweet).toHaveBeenCalledWith(quoteTweet)
    })
  })
})
