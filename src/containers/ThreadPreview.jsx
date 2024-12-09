import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  values,
  valuesIn,
  pipe,
  map,
  omit,
  append,
  equals,
  findIndex,
  lensProp,
  modify,
  propEq,
  remove,
  set,
  includes
} from 'ramda'
import {
  MainWrapper,
  ThreadComponent,
  TreeViewComponent,
  TweetCard,
  MediaUpload,
  Modal,
  ConfirmationModalBody,
  TwitterPreview,
  ShareThreadModal,
  FinalizeThreadErrors,
  ThreadExport
} from '../components'
import {
  createLinkBackTweet,
  createTreeStructure,
  createQuoteTweet,
  createTweetReply,
  deleteTweetAndFixConnections,
  getBackRootDisplayTweet,
  searchTweetText,
  finalizeThread,
  updateAllThreadNodes,
  removeBackLink,
  unlockThread
} from '../utils/thread'
import styled from 'styled-components'
import { Tooltip } from 'react-tooltip'
import {
  useThread,
  useSharedThreadPreview,
  useCallFunctionAsync
} from '../hooks'
import { getIsUserAdmin } from '../utils/auth'
import {
  THREAD_FINALIZE_MODAL_PARAGRAPH,
  THREAD_UNLOCK_MODAL_PARAGRAPH
} from '../constants'
import { User } from '../types'
import { tweetCanLinkBack } from '../utils/misc'

const PreviewWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-basis: 1;
  flex-flow: row nowrap;
  height: 100vh;
  justify-content: center;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
  scrollbar-width: none;
  width: 100%;
`

const TweetPopup = styled(Tooltip)`
  background-color: white;
  border-radius: 1rem;
  border: 1px solid #ccc;
  max-width: 600px;
  padding: 0.5rem;
  position: absolute;
  z-index: 9999;
`

const ThreadPreview = ({ threadId, isExample, token, user }) => {
  const {
    threadDetails,
    setThreadDetails,
    persistedNodes,
    setPersistedNodes,
    tweets,
    setTweets,
    masterTweetId,
    rootDisplayTweetId,
    tweetsInDeletePath,
    selectedTweetId,
    getTweet,
    goToQuoteTweet,
    onBackClick,
    selectTweet
  } = useThread(threadId, isExample, token)

  const [preview, upsertPreview] = useSharedThreadPreview(token, threadId)

  const [showQuote, setShowQuote] = useState(false)
  const [showLinkBack, setShowLinkBack] = useState(false)
  const [mediaUploadType, setMediaUploadType] = useState(null)

  const [hoverTweet, setHoverTweet] = useState(undefined)

  const [showDelete, setShowDelete] = useState(false)
  const [showFinalise, setShowFinalise] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showShareThread, setShowShareThread] = useState(false)
  const [showFinalizeErrors, setShowFinalizeErrors] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [finalizeErrors, setFinalizeErrors] = useState([])

  const masterTweet = getTweet(masterTweetId)
  const rootDisplayTweet = getTweet(rootDisplayTweetId)
  const selectedTweet = getTweet(selectedTweetId)

  const isInDeletePath = tweet => tweetsInDeletePath.includes(tweet.id)

  const goToSelectedBranch = tweet => {
    if (showLinkBack && !tweetCanLinkBack(selectedTweet, tweet)) return
    if (showLinkBack) return addLinkBackTweet(tweet)
    if (showQuote) return

    return selectTweet(tweet)
  }

  useEffect(() => {
    const sanitizeNodes = pipe(valuesIn, map(omit(['col', 'row'])))
    const haveNodesChanged = !equals(sanitizeNodes(tweets), persistedNodes)

    if (tweets && !isExample && haveNodesChanged) {
      updateAllThreadNodes(token, threadId, tweets).then(response => {
        setPersistedNodes(response[0].nodes)
      })
    }
  }, [tweets])

  const [onFinalizeThread, isFinalizing] = useCallFunctionAsync(async () => {
    const {
      valid,
      data: finalizedThread,
      errors
    } = await finalizeThread(token, threadDetails.id)

    if (!valid && errors) {
      setFinalizeErrors(errors)
      setShowFinalizeErrors(true)
    }

    if (valid) {
      const { finalizedAt, finalizedBy } = finalizedThread

      setThreadDetails(prevThread => ({
        ...prevThread,
        finalizedAt: finalizedAt,
        finalizedBy: finalizedBy
      }))
    }

    closeFinaliseModal()
  })

  const [onUnlockThread, isUnlocking] = useCallFunctionAsync(async () => {
    const unlockedThread = await unlockThread(token, threadDetails.id)

    if (!unlockedThread) return

    setThreadDetails(prevThread => ({
      ...prevThread,
      finalizedAt: null,
      finalizedBy: null
    }))

    closeFinaliseModal()
  })

  if (!tweets) return null

  const editTweetText = (id, tweet, text) => {
    const updatedTweet = { ...tweet, text }
    setTweets(prevTweets => ({ ...prevTweets, [id]: updatedTweet }))
  }

  const editTweetCardUri = (id, tweet, cardUri) => {
    const updatedTweet = { ...tweet, cardUri }
    setTweets(prevTweets => ({ ...prevTweets, [id]: updatedTweet }))
  }

  const addTweet = (tweet, replyId) => {
    const replyTweet = replyId ? getTweet(replyId) : null
    const { parentTweet, newTweet, childTweet } = createTweetReply(
      tweet,
      replyTweet
    )

    const newTweets = childTweet
      ? {
          ...tweets,
          [tweet.id]: parentTweet,
          [newTweet.id]: newTweet,
          [replyId]: childTweet
        }
      : {
          ...tweets,
          [tweet.id]: parentTweet,
          [newTweet.id]: newTweet
        }

    const { tweetResults: gridTweets } = createTreeStructure(
      newTweets,
      masterTweetId
    )

    setTweets(gridTweets)
    selectTweet(newTweet)
  }

  const addQuoteTweet = quoteTweet => {
    const { newTweet, parentTweet } = createQuoteTweet(
      selectedTweet,
      quoteTweet
    )

    const newTweets = {
      ...tweets,
      [parentTweet.id]: parentTweet,
      [newTweet.id]: newTweet
    }

    const { tweetResults: gridTweets } = createTreeStructure(
      newTweets,
      masterTweetId
    )

    setTweets(gridTweets)
    setShowQuote(false)
  }

  const addLinkBackTweet = ({ id }) => {
    const newTweet = createLinkBackTweet(selectedTweet, id)

    const newTweets = {
      ...tweets,
      [newTweet.id]: newTweet
    }

    const { tweetResults: gridTweets } = createTreeStructure(
      newTweets,
      masterTweetId
    )

    setTweets(gridTweets)
    setShowLinkBack(false)
    setShowQuote(false)
  }

  const removeLinkBackTweet = () => {
    const newTweet = removeBackLink(selectedTweet)

    const newTweets = {
      ...tweets,
      [newTweet.id]: newTweet
    }

    const { tweetResults: gridTweets } = createTreeStructure(
      newTweets,
      masterTweetId
    )

    setTweets(gridTweets)
  }

  const deleteTweet = () => {
    const newTweets = deleteTweetAndFixConnections(
      tweets,
      selectedTweet.id,
      tweetsInDeletePath
    )

    const { replyToId, replyId, quoteParentId } = selectedTweet
    const nextSelectedTweetId =
      replyId || replyToId || quoteParentId || masterTweetId

    const nextSelectedTweet = newTweets[nextSelectedTweetId]

    const { tweetResults: gridTweets } = createTreeStructure(
      newTweets,
      masterTweetId
    )

    setTweets(gridTweets)
    selectTweet(nextSelectedTweet)
    setShowDelete(false)
  }

  const tweetIsQuoting =
    !!selectedTweet?.quoteTweetId && !selectedTweet?.isQuoteBack

  const addQuoteProps = {
    addQuoteTweet,
    setShowLinkBack,
    showLinkBack,
    showQuote,
    tweetIsQuoting,
    user: threadDetails.twitterProfile
  }

  const onNodeHover = tweet => {
    if (!tweet) {
      setHoverTweet(undefined)
      return
    }

    setHoverTweet(tweet)
  }

  const closeFinaliseModal = () => setShowFinalise(false)

  const removeVideoUrl = (tweet, mediaUrl) => {
    const mediaIndex = findIndex(propEq('videoUrl', mediaUrl), tweet.videos)
    return modify('videos', remove(mediaIndex, 1), tweet)
  }

  const removeImageUrl = (tweet, mediaUrl) => {
    const mediaIndex = findIndex(equals(mediaUrl), tweet.images)
    return modify('images', remove(mediaIndex, 1), tweet)
  }

  const onMediaRemove = (nodeId, isVideo, mediaUrl) => {
    setTweets(prevTweets => {
      const tweet = prevTweets[nodeId]

      if (isVideo)
        return set(
          lensProp(nodeId),
          removeVideoUrl(tweet, mediaUrl),
          prevTweets
        )

      return set(lensProp(nodeId), removeImageUrl(tweet, mediaUrl), prevTweets)
    })
  }

  const handleMediaUpload = (uploadType, mediaUrl) => {
    setTweets(prevTweets => {
      const newMedia =
        mediaUploadType === 'image'
          ? mediaUrl
          : includes(mediaUploadType, ['video', 'gif'])
          ? { videoUrl: mediaUrl, thumbnail_url: '' }
          : null

      if (!newMedia) return prevTweets

      return modify(
        selectedTweetId,
        modify(
          mediaUploadType === 'image' ? 'images' : 'videos',
          append(newMedia)
        )
      )(prevTweets)
    })
  }

  const onConfirmSharePreview = async ({ password }) => {
    if (!password) return

    await upsertPreview(password)
  }

  const togglePreview = () => setShowPreview(prevValue => !prevValue)
  const toggleSharing = () => setShowShareThread(prevValue => !prevValue)
  const onShowExport = () => setShowExport(prevValue => !prevValue)

  const isFinalized = !!threadDetails?.finalizedAt

  return (
    <MainWrapper>
      <MediaUpload
        mediaType={mediaUploadType}
        onModalClose={() => setMediaUploadType(null)}
        onMediaUpload={handleMediaUpload}
        user={user}
        existingCount={{
          videos: selectedTweet.videos.length,
          images: selectedTweet.images.length
        }}
      />

      <Modal
        size={40}
        Body={ConfirmationModalBody}
        show={showFinalise}
        close={closeFinaliseModal}
        heading={isFinalized ? 'Unlock thread' : 'Finalise thread'}
        // ConfirmationModalBody props
        contentText={
          isFinalized
            ? THREAD_UNLOCK_MODAL_PARAGRAPH
            : THREAD_FINALIZE_MODAL_PARAGRAPH
        }
        onCloseModal={closeFinaliseModal}
        onConfirm={isFinalized ? onUnlockThread : onFinalizeThread}
        isBusy={isFinalizing || isUnlocking}
      />

      {showShareThread && (
        <Modal
          size={40}
          Body={ShareThreadModal}
          show={true}
          close={() => setShowShareThread(false)}
          heading='Sharing link'
          subHeading='This allows anyone with the link and password to preview this thread. They will not be able to edit it.'
          // ShareThreadModal props
          onCloseModal={() => setShowShareThread(false)}
          onConfirm={onConfirmSharePreview}
          preview={preview}
        />
      )}

      {showFinalizeErrors && (
        <Modal
          size={60}
          Body={FinalizeThreadErrors}
          show={true}
          close={() => setShowFinalizeErrors(false)}
          heading='Finalise Errors'
          subHeading='The following errors must be fixed before you can finalise this thread. Click on a Post to jump to it. Note that these errors might be outdated until you finalise again.'
          // FinalizeThreadErrors props
          onCloseModal={() => setShowFinalizeErrors(false)}
          finalizeErrors={finalizeErrors}
          setFinalizeErrors={setFinalizeErrors}
          getTweet={getTweet}
          selectTweet={selectTweet}
          thread={threadDetails}
        />
      )}

      {showExport && (
        <Modal
          size={60}
          Body={ThreadExport}
          show={true}
          close={() => setShowExport(false)}
          heading='Export Thread'
          // ThreadExport props
          tweets={values(tweets)}
          thread={threadDetails}
        />
      )}

      {rootDisplayTweet && !showPreview && (
        <ThreadComponent
          addQuoteProps={addQuoteProps}
          addTweet={addTweet}
          handleDelete={deleteTweet}
          editTweetText={editTweetText}
          getTweet={getTweet}
          goToQuoteTweet={goToQuoteTweet}
          onBackClick={onBackClick}
          masterTweet={masterTweet}
          rootDisplayTweet={rootDisplayTweet}
          selectTweet={selectTweet}
          selectedTweet={selectedTweet}
          setShowDelete={setShowDelete}
          showDelete={showDelete}
          setShowQuote={setShowQuote}
          thread={threadDetails}
          getBackRootDisplayTweet={getBackRootDisplayTweet}
          onFinalizeThread={() => setShowFinalise(true)}
          onMediaRemove={onMediaRemove}
          setMediaUploadType={setMediaUploadType}
          removeLinkBackTweet={removeLinkBackTweet}
          isUserAdmin={getIsUserAdmin(user)}
          showFinalizeErrors={() => setShowFinalizeErrors(true)}
          finalizeErrors={finalizeErrors}
          editTweetCardUri={editTweetCardUri}
        />
      )}
      {rootDisplayTweet && showPreview && (
        <PreviewWrapper>
          <TwitterPreview
            thread={threadDetails}
            getTweet={getTweet}
            goToQuoteTweet={goToQuoteTweet}
            masterTweet={masterTweet}
            onBackClick={onBackClick}
            rootDisplayTweet={rootDisplayTweet}
          />
        </PreviewWrapper>
      )}
      {masterTweet && (
        <>
          {hoverTweet && (
            <TweetPopup
              id={`thread-tree-node-${hoverTweet.id}`}
              isOpen={hoverTweet}
            >
              <TweetCard
                getTweet={getTweet}
                goToQuoteTweet={goToQuoteTweet}
                selectTweet={selectTweet}
                showDelete={showDelete}
                thread={threadDetails}
                tweet={hoverTweet}
                tweetsInDeletePath={tweetsInDeletePath}
                isPreview={true}
              />
            </TweetPopup>
          )}
          <TreeViewComponent
            goToSelectedBranch={goToSelectedBranch}
            isInDeletePath={isInDeletePath}
            isUserAdmin={getIsUserAdmin(user)}
            onNodeHover={onNodeHover}
            searchTweetText={searchTweetText}
            selectedTweet={selectedTweet}
            showDelete={showDelete}
            thread={threadDetails}
            tweets={values(tweets)}
            togglePreview={togglePreview}
            showPreview={showPreview}
            toggleSharing={toggleSharing}
            onShowExport={onShowExport}
            showLinkBack={showLinkBack}
          />
        </>
      )}
    </MainWrapper>
  )
}

ThreadPreview.propTypes = {
  threadId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  user: User.isRequired,
  isExample: PropTypes.bool
}

export default ThreadPreview
