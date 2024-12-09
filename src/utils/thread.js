import {
  allPass,
  assoc,
  defaultTo,
  find,
  includes,
  isNil,
  map,
  not,
  omit,
  pick,
  pipe,
  prop,
  reduce,
  trim,
  toLower,
  valuesIn,
  __,
  ifElse
} from 'ramda'
import { v4 as uuidv4 } from 'uuid'
import couldYouSurvive from '../assets/exampleThreads/couldYouSurvive.json'
import { authorized } from './request'
import { joinPaths } from './misc'

const addDefaultTwitterProfile = ifElse(
  thread => !thread || !!thread.twitterProfile,
  thread => thread,
  thread => ({
    ...thread,
    twitterProfile: {
      name: 'Unknown User',
      id: 'unknown_user',
      verified: false
    }
  })
)

// API FUNCTIONS

export const getUserThreads = async token => {
  try {
    const result = await authorized('threads', token)

    if (!result?.data) return null

    return map(addDefaultTwitterProfile, result.data)
  } catch (e) {
    console.error('Fetching user threads failed', { error: e })

    return null
  }
}

export const updateAllThreadNodes = async (token, threadId, nodes) => {
  try {
    const result = await authorized(
      joinPaths('threads', threadId, 'nodes'),
      token,
      {
        method: 'PUT',
        body: pipe(valuesIn, map(omit(['col', 'row'])))(nodes)
      }
    )

    return result?.data ?? []
  } catch (e) {
    console.error('Update nodes failed', { error: e, threadId })

    return null
  }
}

export const getThreadById = async (token, threadId) => {
  try {
    const result = await authorized(joinPaths('threads', threadId), token)

    return addDefaultTwitterProfile(result?.data)
  } catch (e) {
    console.error('Fetching thread by id failed', { error: e, threadId })

    return null
  }
}

export const deleteThread = async (token, threadId) => {
  try {
    await authorized(joinPaths('threads', threadId), token, {
      method: 'DELETE',
      contentType: null
    })

    return true
  } catch (e) {
    console.error('Deleting thread failed', { error: e, threadId })

    return null
  }
}

export const createThread = async (token, thread) => {
  try {
    const result = await authorized('threads', token, {
      method: 'POST',
      body: pick(['name', 'description', 'twitterId'], thread)
    })

    return addDefaultTwitterProfile(result?.data)
  } catch (e) {
    console.error('Creating thread failed', { error: e, thread })

    return null
  }
}

export const updateThread = async (token, thread) => {
  try {
    const result = await authorized(joinPaths('threads', thread.id), token, {
      method: 'PUT',
      body: pick(['name', 'description', 'twitterId'], thread)
    })

    return addDefaultTwitterProfile(result?.data)
  } catch (e) {
    console.error('Updating thread failed', { error: e, thread })

    return null
  }
}

export const duplicateThread = async (token, thread) => {
  try {
    const result = await authorized(
      joinPaths('threads', thread.id, 'duplicate'),
      token,
      {
        method: 'POST',
        body: pick(['name', 'description', 'twitterId'], thread)
      }
    )

    return addDefaultTwitterProfile(result?.data)
  } catch (e) {
    console.error('Updating thread failed', { error: e, thread })

    return null
  }
}

export const finalizeThread = async (token, threadId) => {
  try {
    const result = await authorized(
      joinPaths('threads', threadId, 'finalize'),
      token,
      {
        method: 'POST'
      }
    )

    if (result.status === 400) {
      return { valid: false, errors: result.data.errors }
    }

    return {
      valid: true,
      data: addDefaultTwitterProfile(result?.data)
    }
  } catch (e) {
    console.error('Finalizing thread failed', { error: e, threadId })

    return { valid: false }
  }
}

export const unlockThread = async (token, threadId) => {
  try {
    const result = await authorized(
      joinPaths('threads', threadId, 'unlock'),
      token,
      {
        method: 'POST'
      }
    )

    return addDefaultTwitterProfile(result?.data)
  } catch (e) {
    console.error('Unlocking finalised thread failed', { error: e, threadId })

    return null
  }
}

// OTHER UTILS

const exampleThreads = [
  {
    id: '1',
    name: 'Could you survive?',
    description: 'BBC IPLAYER | Could you survive?',
    nodes: couldYouSurvive,
    twitterProfile: {
      profileImageUrl:
        'https://pbs.twimg.com/profile_images/1450745962016686085/PFHb1vtn_normal.jpg',
      id: '1',
      username: 'BBCiPlayer',
      name: 'BBC iPlayer'
    },
    createdAt: 1676460355000,
    updatedAt: 1676460355000
  }
]

const baseTweet = {
  id: '',
  text: '',
  replyId: '',
  replyToId: null,
  quoteTweetId: null,
  quoteParentId: null,
  images: [],
  videos: [],
  isQuoteBack: false
}

const aggregateExampleThreads = reduce(
  (acc, elem) => ({ ...acc, [elem.id]: elem }),
  {},
  exampleThreads
)

const aggregateTweetsById = tweets =>
  reduce(
    (result, tweet) => ({ ...result, [prop('id', tweet)]: tweet }),
    {},
    tweets
  )

const createLinkBackTweet = (tweet, backTweetId) => ({
  ...tweet,
  quoteTweetId: backTweetId,
  isQuoteBack: true
})

const removeBackLink = tweet => ({
  ...tweet,
  quoteTweetId: null,
  isQuoteBack: false
})

/**
 * @returns Object with prop of "threadResult"
 */
const createTreeStructure = (
  tweets,
  currentTweetId,
  currentRow = 0,
  currentColumn = 0
) => {
  const getTweet = prop(__, tweets)
  const currentTweet = getTweet(currentTweetId)

  if (!currentTweet) return tweets

  const tweetWithGrid = { ...currentTweet, col: currentColumn, row: currentRow }
  const newTweets = { ...tweets, [currentTweetId]: tweetWithGrid }

  const { replyId, quoteTweetId, isQuoteBack } = tweetWithGrid

  const hasQuote = quoteTweetId && !isQuoteBack && getTweet(quoteTweetId)
  const hasReply = replyId && getTweet(replyId)

  // Function to add quote tweet recursively if applicable
  const handleQuoteTweet = innerTweets => {
    if (!hasQuote) return { rowResult: currentRow, tweetResults: innerTweets }

    return createTreeStructure(
      innerTweets,
      quoteTweetId,
      currentRow,
      currentColumn + 1
    )
  }

  // Function to add reply tweet recursively if applicable
  const handleReplyTweet = (innerTweets, row) => {
    if (!hasReply) return { rowResult: row, tweetResults: innerTweets }

    return createTreeStructure(innerTweets, replyId, row + 1, currentColumn)
  }

  // Add quote tweet, and use the resulting thread and row
  // to add any reply tweets applicable.
  const { rowResult, tweetResults } = handleQuoteTweet(newTweets)

  return handleReplyTweet(tweetResults, rowResult)
}

const createQuoteTweet = (
  tweet,
  definedProps = {},
  { generateId = uuidv4, defaultTweet = baseTweet } = {}
) => {
  const newTweet = {
    ...defaultTweet,
    id: generateId(),
    quoteParentId: tweet.id,
    ...definedProps
  }
  const parentTweet = {
    ...tweet,
    quoteTweetId: newTweet.id,
    isQuoteBack: false
  }

  return { newTweet, parentTweet }
}

const createTweetReply = (
  tweet,
  currentReply,
  { generateId = uuidv4 } = {}
) => {
  const newTweet = {
    ...baseTweet,
    id: generateId(),
    replyToId: tweet.id,
    replyId: currentReply ? currentReply.id : null
  }
  const parentTweet = { ...tweet, replyId: newTweet.id }
  const childTweet = currentReply
    ? { ...currentReply, replyToId: newTweet.id }
    : null

  return { newTweet, parentTweet, childTweet }
}

// TODO: Remove this when we have a real API call
const getExampleThreads = async () => await Promise.resolve(exampleThreads)

const getExampleThread = async (threadId, aggregateThreads) =>
  await Promise.resolve(aggregateThreads[threadId])

const getAdventure = async (
  id,
  isExample,
  {
    aggregateThreads = aggregateExampleThreads,
    token = null,
    getThread = getThreadById
  } = {}
) => {
  if (isExample) {
    return await getExampleThread(id, aggregateThreads)
  }

  return await getThread(token, id)
}

export const getQuoteParentTweet = (tweet, getTweet) =>
  pipe(prop('quoteParentId'), getTweet)(tweet)

const getRootTweet = (tweet, getTweet) => {
  if (!tweet.replyToId) return tweet
  return getRootTweet(pipe(prop('replyToId'), getTweet)(tweet), getTweet)
}

const getBackRootDisplayTweet = (rootDisplayTweet, getTweet) => {
  const quoteParent = getQuoteParentTweet(rootDisplayTweet, getTweet)
  return getRootTweet(quoteParent, getTweet)
}

const getMasterTweet = tweets => {
  const hasNoReplyId = pipe(prop('replyToId'), isNil)
  const hasNoQuoteId = pipe(prop('quoteParentId'), isNil)
  const isMasterQuote = allPass([hasNoReplyId, hasNoQuoteId])

  return find(isMasterQuote, tweets)
}

const getQuoteTweet = (tweet, getTweet) => pipe(prop('id'), getTweet)(tweet)

const getTweetById = tweetsById => prop(__, tweetsById)

const isQuoted = pipe(prop('quoteParentId'), isNil, not)

const searchTweetText = searchString => text => {
  if (!searchString) return false

  const sanitizedSearchString = pipe(defaultTo(''), trim, toLower)(searchString)
  return includes(sanitizedSearchString, toLower(text))
}

export const getInitialTweets = ({ generateId = uuidv4 } = {}) => {
  const parentId = generateId()
  return [
    {
      id: parentId,
      text: 'Parent Post',
      images: [],
      videos: [],
      replyId: null,
      replyToId: null,
      quoteTweetId: null,
      quoteParentId: null
    }
  ]
}

const getReplyTweetIds = (replyTweet, getTweet, replyIds = []) => {
  const currentReplyId = replyTweet?.id

  const hasReplyTweet = !!replyTweet?.replyId
  const hasQuoteTweet = replyTweet?.quoteTweetId && !replyTweet.isQuoteBack

  let downstreamQuoteTweets = []
  if (hasQuoteTweet) {
    const quoteTweet = getTweet(replyTweet.quoteTweetId)
    downstreamQuoteTweets = processQuotes(quoteTweet, getTweet)
  }

  if (!hasReplyTweet)
    return [...replyIds, ...downstreamQuoteTweets, currentReplyId]

  const nextReplyTweet = getTweet(replyTweet.replyId)
  return getReplyTweetIds(nextReplyTweet, getTweet, [
    currentReplyId,
    ...replyIds,
    ...downstreamQuoteTweets
  ])
}

const processQuotes = (quoteTweet, getTweet) => {
  const currentQuoteId = quoteTweet?.id
  const hasReplyTweet = !!quoteTweet?.replyId
  const hasQuoteTweet = quoteTweet?.quoteTweetId && !quoteTweet.isQuoteBack

  let replyIds = []

  if (hasReplyTweet) {
    const reply = getTweet(quoteTweet.replyId)
    replyIds = getReplyTweetIds(reply, getTweet)
  }

  let quoteIds = []
  if (hasQuoteTweet) {
    const nextQuoteTweet = getTweet(quoteTweet.quoteTweetId)
    quoteIds = processQuotes(nextQuoteTweet, getTweet)
  }

  return [currentQuoteId, ...replyIds, ...quoteIds]
}

const deleteTweetAndFixConnections = (
  tweets,
  tweetIdToDelete,
  tweetsToDelete
) => {
  const { replyToId, replyId, quoteParentId } = tweets[tweetIdToDelete]

  const parentTweetId = replyToId || null
  const childTweetId = replyId || null
  const quoteParentTweetId = quoteParentId || null

  const parentTweet = parentTweetId
    ? { ...tweets[parentTweetId], replyId: tweets[childTweetId]?.id || null }
    : null

  const childTweet = childTweetId
    ? {
        ...tweets[childTweetId],
        replyToId: tweets[parentTweetId]?.id || null,
        quoteParentId: quoteParentTweetId
      }
    : null

  const quoteParentTweet = quoteParentTweetId
    ? { ...tweets[quoteParentTweetId], quoteTweetId: childTweetId }
    : null

  const removeLinkBack = tweet => {
    if (includes(prop('quoteTweetId', tweet), tweetsToDelete))
      return pipe(
        assoc('quoteTweetId', null),
        assoc('isQuoteBack', false)
      )(tweet)

    return tweet
  }

  return pipe(
    omit(tweetsToDelete),
    assoc(parentTweetId, parentTweet),
    assoc(childTweetId, childTweet),
    assoc(quoteParentTweetId, quoteParentTweet),
    omit([null]),
    map(removeLinkBack)
  )(tweets)
}

const getTweetBreadcrumbs = (
  rootDisplayTweet,
  getBackRootDisplayTweet,
  getTweet,
  result = []
) => {
  if (!rootDisplayTweet?.quoteParentId) return result

  const next = getBackRootDisplayTweet(rootDisplayTweet, getTweet)
  return getTweetBreadcrumbs(next, getBackRootDisplayTweet, getTweet, [
    next,
    ...result
  ])
}

const sanitizeLoadedThread = thread => {
  return thread
    ? {
        ...thread,
        updatedAt: thread.updatedAt ?? thread.createdAt
      }
    : thread
}

const sanitizeLoadedThreads = map(sanitizeLoadedThread)

export {
  aggregateTweetsById,
  baseTweet,
  createLinkBackTweet,
  createQuoteTweet,
  createTreeStructure,
  createTweetReply,
  deleteTweetAndFixConnections,
  exampleThreads,
  getAdventure,
  getBackRootDisplayTweet,
  getExampleThreads,
  getMasterTweet,
  getQuoteTweet,
  getReplyTweetIds,
  getRootTweet,
  getTweetBreadcrumbs,
  getTweetById,
  isQuoted,
  processQuotes,
  removeBackLink,
  sanitizeLoadedThread,
  sanitizeLoadedThreads,
  searchTweetText
}
