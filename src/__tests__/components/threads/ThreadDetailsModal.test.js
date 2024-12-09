import { fireEvent, render, waitFor } from '@testing-library/react'
import { ThreadDetailsModal } from '../../../components/threads/ThreadDetailsModal'

describe('ThreadDetailsModal', () => {
  const thread = {
    name: '',
    description: '',
    id: '',
    twitterProfile: { id: 'asd', username: '' }
  }

  describe('when the user searches for a Twitter user', () => {
    describe('and the user is found', () => {
      it('should search for user and set user label', async () => {
        const userHandleResponse = 'userHandleResponse'
        const onSave = jest.fn()
        const fetchTwitterUserByHandle = jest
          .fn()
          .mockResolvedValue({ username: userHandleResponse })

        const { getByTestId } = render(
          <ThreadDetailsModal
            fetchTwitterUserByHandle={fetchTwitterUserByHandle}
            onSave={onSave}
            thread={thread}
          />
        )

        const currentUser = getByTestId('thread-details-current-user-text')
        const searchInput = getByTestId(
          'thread-details-twitter-user-search-input'
        )
        const searchButton = getByTestId(
          'thread-details-twitter-user-search-button'
        )

        fireEvent.change(searchInput, { target: { value: 'userHandle' } })
        searchButton.click()

        await waitFor(() => {
          expect(currentUser.textContent).toEqual(
            'Current user: @userHandleResponse'
          )
          expect(fetchTwitterUserByHandle).toHaveBeenCalledWith('userhandle')
        })
      })
    })

    describe('and the user is not found', () => {
      it('should display an error message', async () => {
        const onSave = jest.fn()
        const fetchTwitterUserByHandle = jest.fn().mockResolvedValue(null)

        const { getByTestId } = render(
          <ThreadDetailsModal
            fetchTwitterUserByHandle={fetchTwitterUserByHandle}
            onSave={onSave}
            thread={thread}
          />
        )

        const currentUser = getByTestId('thread-details-current-user-text')
        const searchInput = getByTestId(
          'thread-details-twitter-user-search-input'
        )
        const searchButton = getByTestId(
          'thread-details-twitter-user-search-button'
        )

        fireEvent.change(searchInput, { target: { value: 'userHandle' } })
        searchButton.click()

        await waitFor(() => {
          const searchError = getByTestId('thread-details-twitter-search-error')
          expect(searchError.textContent).toEqual('User "userhandle" not found')
        })

        await waitFor(() => {
          expect(currentUser.textContent).toEqual('Current user: @')
          expect(fetchTwitterUserByHandle).toHaveBeenCalledWith('userhandle')
        })
      })
    })

    describe('and the twitter handle is prefixed with @', () => {
      it('should trim @ sign and search for user', async () => {
        const userHandleResponse = 'userHandleResponse'
        const onSave = jest.fn()
        const fetchTwitterUserByHandle = jest
          .fn()
          .mockResolvedValue({ username: userHandleResponse })

        const { getByTestId } = render(
          <ThreadDetailsModal
            fetchTwitterUserByHandle={fetchTwitterUserByHandle}
            onSave={onSave}
            thread={thread}
          />
        )

        const currentUser = getByTestId('thread-details-current-user-text')
        const searchInput = getByTestId(
          'thread-details-twitter-user-search-input'
        )
        const searchButton = getByTestId(
          'thread-details-twitter-user-search-button'
        )

        const userSearchText = '@userHandle'
        fireEvent.change(searchInput, { target: { value: userSearchText } })
        searchButton.click()

        await waitFor(() => {
          expect(currentUser.textContent).toEqual(
            'Current user: @userHandleResponse'
          )
          expect(fetchTwitterUserByHandle).toHaveBeenCalledWith('userhandle')
        })
      })
    })
  })
})
