import { render } from '@testing-library/react'
import { TweetReplyThread } from '../../../components'

describe('TweetReplyThread', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const addTweet = jest.fn()
  const editTweetText = jest.fn()
  const getTweet = jest.fn()
  const goToQuoteTweet = jest.fn()
  const masterTweet = { id: '1', replyId: '2', text: 'tweet 1' }
  const selectedTweet = {
    id: 'someOtherTweet',
    replyId: '2',
    text: 'tweet 1'
  }
  const selectTweet = jest.fn()
  const setShowQuote = jest.fn()
  const tweet = { id: '1', text: 'tweet text' }
  const thread = {
    name: 'Thread Name',
    twitterProfile: {
      name: 'User Name',
      username: 'user.handle',
      profileImageUrl: 'some.picture'
    }
  }

  const props = {
    addTweet,
    editTweetText,
    getTweet,
    goToQuoteTweet,
    masterTweet,
    selectedTweet,
    selectTweet,
    tweet,
    thread,
    setShowQuote
  }

  it('should render without crashing', () => {
    render(<TweetReplyThread {...props} />)
  })

  describe('when reply id has no value', () => {
    it('should render single tweet card', () => {
      const { getByTestId } = render(<TweetReplyThread {...props} />)

      expect(getByTestId('tweet-card-1')).toBeInTheDocument()
      expect(getTweet).not.toHaveBeenCalled()
    })
  })

  describe('when reply id has a value', () => {
    it('should get reply tweet and render tweets and replies recursively', () => {
      const newTweet = { id: '1', replyId: '2', text: 'tweet 1' }

      getTweet
        .mockReturnValueOnce({ id: '2', replyId: '3', text: 'tweet 2' })
        .mockReturnValueOnce({ id: '3', replyId: null, text: 'tweet 3' })

      const { getByTestId } = render(
        <TweetReplyThread {...props} tweet={newTweet} />
      )

      expect(getByTestId('tweet-card-1')).toBeInTheDocument()
      expect(getByTestId('tweet-card-2')).toBeInTheDocument()
      expect(getByTestId('tweet-card-3')).toBeInTheDocument()
    })
  })

  // describe('when the tweet is also the selected tweet', () => {
  //   it('should render a single editing tweet card', () => {
  //     const newSelectedTweet = { id: '1', replyId: '2', text: 'tweet 1' }

  //     const { getByTestId } = render(
  //       <TweetReplyThread {...props} selectedTweet={newSelectedTweet} />
  //     )

  //     expect(getByTestId('tweet-edit-card-1')).toBeInTheDocument()
  //     expect(getTweet).not.toHaveBeenCalled()
  //   })
  // })
})
