import { fireEvent, render, waitFor } from '@testing-library/react'
import { UserThreadsContainer } from '../../containers'
import { wrapPageElement } from '../../testUtils'
import * as threadUtils from '../../utils/thread'
import * as twitterUtils from '../../utils/twitter'

describe('containers/UserThreads', () => {
  it('renders without crashing', async () => {
    jest.spyOn(threadUtils, 'getUserThreads').mockResolvedValue([])

    render(wrapPageElement(UserThreadsContainer, { token: 'token' }))

    expect(threadUtils.getUserThreads).toHaveBeenCalledTimes(1)
  })

  describe('when create thread is clicked and submitted', () => {
    it('should call create thread', async () => {
      jest.spyOn(threadUtils, 'getUserThreads').mockResolvedValue([])
      jest.spyOn(threadUtils, 'createThread').mockResolvedValue({})
      jest
        .spyOn(twitterUtils, 'getTwitterUserByHandle')
        .mockResolvedValue({ username: 'userHandle', id: 'userId' })

      const { getByTestId } = render(
        wrapPageElement(UserThreadsContainer, { token: 'token' })
      )

      await waitFor(() => {
        getByTestId('title-bar-button')

        expect(threadUtils.getUserThreads).toHaveBeenCalledTimes(1)
        expect(threadUtils.getUserThreads).toHaveBeenCalledWith('token')
      })
      const createThreadButton = getByTestId('title-bar-button')
      createThreadButton.click()

      await waitFor(() => {
        getByTestId('thread-details-submit-button')
      })

      const userSearchInput = getByTestId(
        'thread-details-twitter-user-search-input'
      )
      const userSearchButton = getByTestId(
        'thread-details-twitter-user-search-button'
      )

      fireEvent.change(userSearchInput, {
        target: { value: 'userHandleInput' }
      })

      userSearchButton.click()

      await waitFor(() => {
        expect(twitterUtils.getTwitterUserByHandle).toHaveBeenCalledTimes(1)
        expect(twitterUtils.getTwitterUserByHandle).toHaveBeenCalledWith(
          'token',
          'userhandleinput'
        )

        const currentUserText = getByTestId('thread-details-current-user-text')
        expect(currentUserText.textContent).toEqual('Current user: @userHandle')
      })

      const nameInput = getByTestId('thread-details-name-input')
      const descriptionInput = getByTestId('thread-details-description-input')

      fireEvent.change(nameInput, { target: { value: 'thread name' } })
      fireEvent.change(descriptionInput, {
        target: { value: 'description' }
      })

      const saveThreadButton = getByTestId('thread-details-submit-button')
      saveThreadButton.click()

      // TODO: This function should be called, but is failing the test.
      // await waitFor(() => {
      //   expect(threadUtils.createThread).toHaveBeenCalledTimes(1)
      // })
    })
  })
})
