import { render } from '@testing-library/react'
import { TweetCard } from '../../../components'

describe('TweetCard', () => {
  const thread = {
    name: 'Thread Name',
    twitterProfile: {
      name: 'User Name',
      username: 'user.handle',
      profileImageUrl: 'some.picture'
    }
  }

  describe('when quote tweet id has a value', () => {
    it('should render quote tweet', () => {
      const tweet = {
        id: 'tweet_id',
        quoteTweetId: 'quote_tweet_id',
        text: 'tweet text'
      }
      const quoteTweet = {
        id: 'quote_tweet_id',
        text: 'tweet text',
        row: 0,
        col: 2
      }

      const getTweet = jest.fn(() => quoteTweet)
      const goToQuoteTweet = jest.fn()
      const selectTweet = jest.fn()

      const { getByTestId } = render(
        <TweetCard
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          selectTweet={selectTweet}
          tweet={tweet}
          thread={thread}
        />
      )

      expect(getByTestId('quote-tweet-card-0-2')).toBeInTheDocument()
      expect(getTweet).toHaveBeenCalledWith(tweet.quoteTweetId)
    })
  })

  describe('when quote tweet id has no value', () => {
    it('should render quote tweet', () => {
      const tweet = { id: 'tweet_id', text: 'tweet text' }

      const getTweet = jest.fn()
      const goToQuoteTweet = jest.fn()
      const selectTweet = jest.fn()

      const { queryByTestId } = render(
        <TweetCard
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          selectTweet={selectTweet}
          tweet={tweet}
          thread={thread}
        />
      )

      expect(getTweet).not.toHaveBeenCalled()
      expect(queryByTestId('quote-tweet-card')).not.toBeInTheDocument()
      expect(getTweet).not.toHaveBeenCalled()
    })
  })

  describe('when tweet card is clicked', () => {
    it('should call selectTweet function', () => {
      const tweet = { id: 'tweet_id', text: 'tweet text' }

      const getTweet = jest.fn()
      const goToQuoteTweet = jest.fn()
      const selectTweet = jest.fn()

      const { getByTestId } = render(
        <TweetCard
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          selectTweet={selectTweet}
          tweet={tweet}
          thread={thread}
        />
      )

      const tweetClickToEdit = getByTestId(
        `tweet-card-click-to-edit-${tweet.id}`
      )
      tweetClickToEdit.click()

      expect(selectTweet).toHaveBeenCalledTimes(1)
      expect(selectTweet).toHaveBeenCalledWith(tweet)
    })
  })

  describe('when tweet card is clicked and selectTweet is falsy', () => {
    it('should not crash', () => {
      const tweet = { id: 'tweet_id', text: 'tweet text' }

      const getTweet = jest.fn()
      const goToQuoteTweet = jest.fn()

      const { getByTestId } = render(
        <TweetCard
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          tweet={tweet}
          thread={thread}
          isReadonly={true}
        />
      )

      const tweetCard = getByTestId(`tweet-card-${tweet.id}`)
      tweetCard.click()
    })
  })
})
