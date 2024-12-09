import { render } from '@testing-library/react'
import { QuoteTweetCard } from '../../../components'

describe('QuoteTweetCard', () => {
  const parentTweet = { id: '2', text: 'parent tweet text' }

  it('should render without crashing', () => {
    const handle = 'userHandle'
    const name = 'user name'
    const goToQuoteTweet = jest.fn()
    const tweet = { id: '1', text: 'tweet text', row: 0, col: 1 }

    const { getByText, getByTestId } = render(
      <QuoteTweetCard
        handle={handle}
        name={name}
        goToQuoteTweet={goToQuoteTweet}
        tweet={tweet}
        parentTweet={parentTweet}
      />
    )

    expect(getByTestId('quote-tweet-card-0-1')).toBeInTheDocument()
    expect(getByText(name)).toBeInTheDocument()
    expect(getByText(`@${handle}`)).toBeInTheDocument()
  })

  describe('when quote tweet card is clicked', () => {
    it('should call passed in goToQuoteTweet function', () => {
      const handle = 'userHandle'
      const name = 'user name'
      const goToQuoteTweet = jest.fn()
      const tweet = { id: '1', text: 'tweet text', row: 1, col: 0 }

      const { getByTestId } = render(
        <QuoteTweetCard
          goToQuoteTweet={goToQuoteTweet}
          handle={handle}
          name={name}
          tweet={tweet}
          parentTweet={parentTweet}
        />
      )

      const quoteCard = getByTestId('quote-tweet-card-1-0')
      quoteCard.click()

      expect(goToQuoteTweet).toHaveBeenCalledWith(tweet)
    })
  })
})
