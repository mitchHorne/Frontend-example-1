import { useEffect, useState } from 'react'
import {
  createThread,
  deleteThread,
  duplicateThread,
  getUserThreads,
  sanitizeLoadedThread,
  sanitizeLoadedThreads,
  updateThread
} from '../utils/thread'
import {
  equals,
  findIndex,
  mergeDeepLeft,
  modify,
  pipe,
  prop,
  remove
} from 'ramda'
import {
  ThreadMenuComponent,
  ThreadDetailsModal,
  ContextMenu,
  ConfirmationModalBody,
  TwitterPreview
} from '../components'
import { Modal } from '../components/modal'
import PropTypes from 'prop-types'
import { getTwitterUserByHandle } from '../utils/twitter'
import styled from 'styled-components'
import { useThread, useCallFunctionAsync } from '../hooks'
import { useNavigate } from 'react-router'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 100vh;
  min-height: 100vh;
`

const ThreadMenuWrapper = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 10rem;
  scrollbar-width: 0;
  width: 100%;
`

const ThreadPreviewWrapper = styled.div`
  align-items: ${({ isPreviewLoading }) =>
    isPreviewLoading ? 'center' : 'flex-start'};
  background-color: rgb(239, 243, 244);
  display: flex;
  justify-content: center;
  min-width: 600px;
  overflow-y: auto;
  padding: 2rem 0;
  position: relative;
  width: 600px;
`

const UserThreadsContainer = ({ token }) => {
  const [threads, setThreads] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contextThread, setContextThread] = useState(undefined)
  const [clickPosition, setClickPosition] = useState(null)
  const [hoverThread, setHoverThread] = useState()
  const navigate = useNavigate()

  const {
    threadDetails,
    getTweet,
    goToQuoteTweet,
    masterTweetId,
    onBackClick,
    rootDisplayTweetId
  } = useThread(hoverThread?.id, false, token, { loadedThread: hoverThread })

  const masterTweet = getTweet(masterTweetId)
  const rootDisplayTweet = getTweet(rootDisplayTweetId)

  const isPreviewLoading = hoverThread && hoverThread.id !== threadDetails?.id

  useEffect(() => {
    const handleClick = () => setClickPosition(null)
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    if (!threads) getAdventures(token)
  }, [])

  const [getAdventures] = useCallFunctionAsync(async token => {
    const threadResponse = await getUserThreads(token)
    setThreads(sanitizeLoadedThreads(threadResponse))
  })

  const [onSaveThreadDetails, saveThreadDetailsIsBusy] = useCallFunctionAsync(
    async thread => {
      const { id } = thread
      if (!id) {
        const createdThread = await createThread(token, thread)

        setThreads(prevThreads => [
          ...prevThreads,
          sanitizeLoadedThread(createdThread)
        ])

        onCloseContextModal()
        return navigateToEdit(createdThread.id)
      }

      const updatedThread = await updateThread(token, thread)
      setThreads(prevThreads => {
        const existingIndex = findIndex(pipe(prop('id'), equals(id)))(
          prevThreads
        )

        return modify(existingIndex, mergeDeepLeft(updatedThread))(prevThreads)
      })

      onCloseContextModal()
    }
  )

  const [onSaveDuplicateThread, saveDuplicateIsBusy] = useCallFunctionAsync(
    async thread => {
      const duplicatedThread = await duplicateThread(token, thread)
      setThreads(prevThreads => [
        ...prevThreads,
        sanitizeLoadedThread(duplicatedThread)
      ])

      onCloseContextModal()
      navigateToEdit(duplicatedThread.id)
    }
  )

  const [fetchTwitterUserByHandle, searchTwitterUserIsBusy] =
    useCallFunctionAsync(
      async handle => await getTwitterUserByHandle(token, handle)
    )

  const [onThreadDelete, deleteIsBusy] = useCallFunctionAsync(async () => {
    const { id } = contextThread

    const result = await deleteThread(token, id)

    if (result) {
      setThreads(prevThreads => {
        const existingIndex = findIndex(pipe(prop('id'), equals(id)))(
          prevThreads
        )

        return remove(existingIndex, 1, prevThreads)
      })

      if (hoverThread?.id === id) setHoverThread(null)
    }

    onCloseContextModal()
  })

  const onAddThread = () => {
    setContextThread(undefined)
    setShowEditModal(true)
  }

  const onCloseContextModal = () => {
    setShowEditModal(false)
    setShowDuplicateModal(false)
    setShowDeleteModal(false)
    setContextThread(undefined)
  }

  const navigateToEdit = threadId => {
    navigate(`/threads/${threadId}`)
  }

  const onEditTriggered = () => {
    setShowEditModal(true)
  }

  const onDeleteTriggered = () => {
    setShowDeleteModal(true)
  }

  const onDuplicateTriggered = () => {
    setShowDuplicateModal(true)
  }

  const onContextMenu = (e, thread) => {
    e.preventDefault()

    const { pageX, pageY, view } = e
    const { innerWidth, innerHeight } = view

    const left = pageX + 200 >= innerWidth ? pageX - 200 : pageX
    const top = pageY + 93 >= innerHeight ? pageY - 93 : pageY

    setClickPosition({ left, top })

    setContextThread(thread)
  }

  if (!threads) return null

  const getEditModalHeading = () => {
    if (showDuplicateModal) return 'Duplicate Thread'

    return `${contextThread?.id ? 'Edit' : 'Create'} Thread`
  }

  return (
    <>
      <Wrapper>
        <ThreadMenuWrapper>
          <ThreadMenuComponent
            threads={threads}
            heading='Threads'
            onAddThread={onAddThread}
            relativeRoute={'threads/'}
            onContextMenu={onContextMenu}
            setHoverThread={setHoverThread}
          />
        </ThreadMenuWrapper>
        <ThreadPreviewWrapper isPreviewLoading={isPreviewLoading}>
          {threadDetails && !isPreviewLoading && (
            <TwitterPreview
              thread={threadDetails}
              getTweet={getTweet}
              goToQuoteTweet={goToQuoteTweet}
              masterTweet={masterTweet}
              onBackClick={onBackClick}
              rootDisplayTweet={rootDisplayTweet}
            />
          )}
        </ThreadPreviewWrapper>
      </Wrapper>
      {(showEditModal || showDuplicateModal) && (
        <Modal
          size={50}
          Body={ThreadDetailsModal}
          show={true}
          close={onCloseContextModal}
          heading={getEditModalHeading()}
          // ThreadDetailsModal props
          onSave={showEditModal ? onSaveThreadDetails : onSaveDuplicateThread}
          saveIsBusy={
            showEditModal ? saveThreadDetailsIsBusy : saveDuplicateIsBusy
          }
          thread={contextThread}
          fetchTwitterUserByHandle={fetchTwitterUserByHandle}
          searchIsBusy={searchTwitterUserIsBusy}
        />
      )}
      <Modal
        size={50}
        Body={ConfirmationModalBody}
        show={showDeleteModal}
        close={onCloseContextModal}
        heading='Delete thread'
        // ConfirmationModalBody props
        contentText='Are you sure you wish to delete this entire thread?'
        onCloseModal={onCloseContextModal}
        onConfirm={onThreadDelete}
        confirmButtonBackground='red'
        isBusy={deleteIsBusy}
      />
      {clickPosition && (
        <ContextMenu
          left={clickPosition.left}
          top={clickPosition.top}
          onEdit={onEditTriggered}
          onDelete={onDeleteTriggered}
          onDuplicate={onDuplicateTriggered}
          canEdit={!contextThread?.finalizedAt}
        />
      )}
    </>
  )
}

UserThreadsContainer.propTypes = {
  token: PropTypes.string.isRequired
}

export default UserThreadsContainer
