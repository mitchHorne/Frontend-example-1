import { useState } from 'react'
import {
  aggregateTweetsById,
  createTreeStructure,
  getTweetById,
  getMasterTweet,
  getRootTweet,
  processQuotes,
  getInitialTweets,
  getQuoteTweet,
  getBackRootDisplayTweet,
  sanitizeLoadedThread,
  getQuoteParentTweet
} from '../utils/thread'

export const useThreadManagement = () => {
  const [threadDetails, setThreadDetails] = useState(null)
  const [persistedNodes, setPersistedNodes] = useState([])
  const [tweets, setTweets] = useState(null)
  const [masterTweetId, setMasterTweetId] = useState(null)
  const [rootDisplayTweetId, setRootDisplayTweetId] = useState(null)
  const [tweetsInDeletePath, setTweetsInDeletePath] = useState([])
  const [selectedTweetId, setSelectedTweetId] = useState(null)

  const getTweet = getTweetById(tweets)

  const rootDisplayTweet = getTweet(rootDisplayTweetId)

  const getTweetsInDeletePath = tweet => {
    const hasQuoteTweet = tweet?.quoteTweetId && !tweet.isQuoteBack

    // If the origin tweet has no quote tweets, only it is to be deleted
    if (!hasQuoteTweet) return [tweet.id]

    const quoteTweet = getTweet(tweet.quoteTweetId)
    const downStreamTweets = processQuotes(quoteTweet, getTweet)

    return [tweet.id, ...downStreamTweets]
  }

  const selectTweet = tweet => {
    const deleteTweets = getTweetsInDeletePath(tweet)
    setTweetsInDeletePath(deleteTweets)

    const rootTweet = getRootTweet(tweet, getTweet)
    setRootDisplayTweetId(rootTweet.id)

    return setSelectedTweetId(tweet.id)
  }

  const goToQuoteTweet = tweet => {
    const quoteTweet = getQuoteTweet(tweet, getTweet)
    setRootDisplayTweetId(quoteTweet.id)

    selectTweet(quoteTweet)
  }

  const onBackClick = () => {
    const backTweet = getBackRootDisplayTweet(rootDisplayTweet, getTweet)
    setRootDisplayTweetId(backTweet.id)

    const quoteParent = getQuoteParentTweet(rootDisplayTweet, getTweet)
    selectTweet(quoteParent)
  }

  const clearThread = () => {
    setThreadDetails(null)
    setPersistedNodes([])
  }

  const setInitialThreadData = (nodes, thread) => {
    if (!thread || !nodes) return clearThread()

    setThreadDetails(thread)
    const tweets = nodes.length ? nodes : getInitialTweets()
    setPersistedNodes(nodes)

    const { id: masterId } = getMasterTweet(tweets)

    const tweetsById = aggregateTweetsById(tweets)
    const { tweetResults: gridTweets } = createTreeStructure(
      tweetsById,
      masterId
    )
    setTweets(gridTweets)

    const initTweet = gridTweets[masterId]
    setMasterTweetId(initTweet.id)
    setRootDisplayTweetId(initTweet.id)

    selectTweet(initTweet)
  }

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
    setInitialThreadData,
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
