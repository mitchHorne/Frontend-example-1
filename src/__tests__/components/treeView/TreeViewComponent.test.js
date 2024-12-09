import { render } from '@testing-library/react'
import { TreeViewComponent } from '../../../components/'

describe('TreeViewComponent', () => {
  it('should render without crashing', () => {
    const goToSelectedBranch = jest.fn()
    const onNodeHover = jest.fn()
    const selectedTweet = { id: '1', text: 'tweet text' }
    const searchTweetText = jest.fn(() => jest.fn())
    const tweets = [{ id: '1', text: 'abc', row: 0, col: 0 }]

    render(
      <TreeViewComponent
        goToSelectedBranch={goToSelectedBranch}
        selectedTweet={selectedTweet}
        searchTweetText={searchTweetText}
        tweets={tweets}
        onNodeHover={onNodeHover}
        isInDeletePath={() => false}
        togglePreview={() => {}}
        toggleSharing={() => {}}
        showPreview={false}
        showDelete={false}
        thread={{}}
      />
    )
  })
})
