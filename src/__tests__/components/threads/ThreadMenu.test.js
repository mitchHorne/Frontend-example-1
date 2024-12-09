import { fireEvent, render, waitFor } from '@testing-library/react'
import { ThreadMenuComponent } from '../../../components'
import { wrapPageElement } from '../../../testUtils'

describe('ThreadMenu', () => {
  it('renders without crashing', () => {
    render(
      <ThreadMenuComponent
        heading={''}
        onAddThread={jest.fn()}
        onContextMenu={jest.fn()}
        relativeRoute={''}
        setHoverThread={jest.fn()}
        subHeading={''}
        threads={[]}
      />
    )
  })

  describe('when there are threads', () => {
    it('should only render all threads', async () => {
      const threads = [
        {
          id: 'thread-id-1',
          twitterProfile: { username: 'user-1', id: 'user-id-1' },
          description: 'thread-1-description',
          name: 'thread-1',
          tweets: []
        },
        {
          id: 'thread-id-2',
          twitterProfile: { username: 'user-1', id: 'user-id-1' },
          description: 'thread-2-description',
          name: 'thread-2',
          tweets: []
        },
        {
          id: 'thread-id-3',
          twitterProfile: { username: 'user-2', id: 'user-id-2' },
          description: 'thread-3-description',
          name: 'thread-3',
          tweets: []
        }
      ]
      const heading = ''
      const subHeading = ''
      const onAddThread = jest.fn()
      const onContextMenu = jest.fn()
      const relativeRoute = ''
      const setHoverThread = jest.fn()

      const { queryAllByTestId } = render(
        wrapPageElement(ThreadMenuComponent, {
          threads,
          heading,
          subHeading,
          onAddThread,
          onContextMenu,
          relativeRoute,
          setHoverThread
        })
      )

      await waitFor(() => {
        const threadItems = queryAllByTestId(/thread-option-thread-id-\d/)
        expect(threadItems).toHaveLength(3)
      })
    })
  })

  describe('when threads are filtered by user handle', () => {
    it('should only render threads by that user', async () => {
      const threads = [
        {
          id: 'thread-id-1',
          twitterProfile: { username: 'user-1', id: 'user-id-1' },
          description: 'thread-1-description',
          name: 'thread-1',
          tweets: []
        },
        {
          id: 'thread-id-2',
          twitterProfile: { username: 'user-1', id: 'user-id-1' },
          description: 'thread-2-description',
          name: 'thread-2',
          tweets: []
        },
        {
          id: 'thread-id-3',
          twitterProfile: { username: 'user-2', id: 'user-id-2' },
          description: 'thread-3-description',
          name: 'thread-3',
          tweets: []
        }
      ]
      const heading = ''
      const subHeading = ''
      const onAddThread = jest.fn()
      const onContextMenu = jest.fn()
      const relativeRoute = ''
      const setHoverThread = jest.fn()

      const { queryAllByTestId, getByText } = render(
        wrapPageElement(ThreadMenuComponent, {
          threads,
          heading,
          subHeading,
          onAddThread,
          onContextMenu,
          relativeRoute,
          setHoverThread
        })
      )
      const filterSelect = getByText('Filter by handle')

      const userHandle = '@user-2'
      fireEvent.keyDown(filterSelect, { key: 'ArrowDown' })
      await waitFor(() => getByText(userHandle))
      fireEvent.click(getByText(userHandle))

      await waitFor(() => {
        const threadItems = queryAllByTestId(/thread-option-thread-id-\d/)
        expect(threadItems).toHaveLength(1)
      })
    })
  })
})
