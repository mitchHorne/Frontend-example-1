import { useEffect } from 'react'
import { getAdventure, sanitizeLoadedThread } from '../utils/thread'
import { useErrorBoundary } from 'react-error-boundary'
import { useThreadManagement } from './useThreadManagement'
import { omit } from 'ramda'

export const useThread = (
  threadId,
  isExample,
  token,
  { loadedThread = null } = {}
) => {
  const { showBoundary } = useErrorBoundary()

  const {
    getTweet,
    getTweetsInDeletePath,
    goToQuoteTweet,
    masterTweetId,
    onBackClick,
    persistedNodes,
    rootDisplayTweetId,
    selectedTweetId,
    selectTweet,
    setInitialThreadData,
    setMasterTweetId,
    setPersistedNodes,
    setRootDisplayTweetId,
    setSelectedTweetId,
    setThreadDetails,
    setTweets,
    setTweetsInDeletePath,
    threadDetails,
    tweets,
    tweetsInDeletePath
  } = useThreadManagement()

  useEffect(() => {
    const fetchAndCacheAdventure = async () => {
      if (!threadId) return setInitialThreadData([], null)

      if (loadedThread)
        return setInitialThreadData(
          loadedThread.nodes,
          omit(['nodes'], loadedThread)
        )

      await getAdventure(threadId, isExample, { token })
        .then(({ nodes, ...thread }) => setInitialThreadData(nodes, thread))
        .catch(err => {
          const error = new Error(
            `There was an error loading this Thread - ${err.message}`
          )
          showBoundary(error)
        })
    }

    fetchAndCacheAdventure()
  }, [threadId])

  return {
    getTweet,
    getTweetsInDeletePath,
    goToQuoteTweet,
    masterTweetId,
    onBackClick,
    persistedNodes,
    rootDisplayTweetId,
    selectedTweetId,
    selectTweet,
    setMasterTweetId,
    setPersistedNodes,
    setRootDisplayTweetId,
    setSelectedTweetId,
    setThreadDetails,
    setTweets,
    setTweetsInDeletePath,
    threadDetails: sanitizeLoadedThread(threadDetails),
    tweets,
    tweetsInDeletePath
  }
}
