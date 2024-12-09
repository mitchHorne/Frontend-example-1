import simple from 'simple-mock'
import { mapObjIndexed, omit, prop } from 'ramda'
import * as request from '../../utils/request'

import {
  aggregateTweetsById,
  baseTweet,
  createLinkBackTweet,
  createQuoteTweet,
  createThread,
  createTreeStructure,
  createTweetReply,
  deleteThread,
  duplicateThread,
  exampleThreads,
  finalizeThread,
  getAdventure,
  getBackRootDisplayTweet,
  getExampleThreads,
  getInitialTweets,
  getMasterTweet,
  getQuoteTweet,
  getReplyTweetIds,
  getRootTweet,
  getThreadById,
  getTweetById,
  getUserThreads,
  isQuoted,
  processQuotes,
  removeBackLink,
  searchTweetText,
  unlockThread,
  updateAllThreadNodes,
  updateThread
} from '../../utils/thread'

describe('thread utils', () => {
  const threadWithoutProfile = {
    id: '1',
    name: 'thread 1',
    tweets: []
  }
  const threadWithDefaultProfile = {
    ...threadWithoutProfile,
    twitterProfile: {
      id: 'unknown_user',
      name: 'Unknown User',
      verified: false
    }
  }
  const thread = {
    ...threadWithoutProfile,
    twitterProfile: {
      id: 'user_id',
      name: 'Some User',
      verified: false,
      username: 'someUser'
    }
  }

  describe('getExampleThreads', () => {
    it('should return hard coded examples', async () => {
      const threads = await getExampleThreads()
      expect(threads).toEqual(exampleThreads)
    })
  })

  describe('aggregateTweetsById', () => {
    it('should return an object with tweet ids as keys', () => {
      const tweets = [
        { id: '1', text: 'tweet 1' },
        { id: '2', text: 'tweet 2' }
      ]

      const result = aggregateTweetsById(tweets)

      expect(result).toEqual({
        1: { id: '1', text: 'tweet 1' },
        2: { id: '2', text: 'tweet 2' }
      })
    })
  })

  describe('createTreeStructure', () => {
    it('should add expected column and row indices', async () => {
      const expected = {
        ['1']: {
          isQuoteBack: false,
          quoteTweetId: '',
          replyId: '2',
          col: 0,
          row: 0
        },
        ['2']: {
          isQuoteBack: false,
          quoteTweetId: '3',
          replyId: '5',
          col: 0,
          row: 1
        },
        ['3']: {
          isQuoteBack: false,
          quoteTweetId: '',
          replyId: '4',
          col: 1,
          row: 1
        },
        ['4']: {
          isQuoteBack: false,
          quoteTweetId: '',
          replyId: '',
          col: 1,
          row: 2
        },
        ['5']: {
          isQuoteBack: false,
          quoteTweetId: '6',
          replyId: '',
          col: 0,
          row: 3
        },
        ['6']: {
          isQuoteBack: false,
          quoteTweetId: '',
          replyId: '7',
          col: 1,
          row: 3
        },
        ['7']: {
          isQuoteBack: true,
          quoteTweetId: '',
          replyId: '',
          col: 1,
          row: 4
        }
      }
      const input = mapObjIndexed(
        value => omit(['col', 'row'], value),
        expected
      )
      const { tweetResults } = createTreeStructure(input, '1')
      expect(tweetResults).toEqual(expected)
    })

    describe('when we only have replies', () => {
      it('should add expected column and row indices', async () => {
        const expected = {
          ['1']: {
            replyId: '2',
            col: 0,
            row: 0
          },
          ['2']: {
            replyId: '3',
            col: 0,
            row: 1
          },
          ['3']: {
            replyId: '4',
            col: 0,
            row: 2
          },
          ['4']: {
            replyId: '',
            col: 0,
            row: 3
          }
        }
        const input = mapObjIndexed(
          value => omit(['col', 'row'], value),
          expected
        )
        const { tweetResults } = createTreeStructure(input, '1')
        expect(tweetResults).toEqual(expected)
      })
    })

    describe('when we only have quotes', () => {
      it('should add expected column and row indices', async () => {
        const expected = {
          ['1']: {
            quoteTweetId: '2',
            row: 0,
            col: 0
          },
          ['2']: {
            quoteTweetId: '3',
            row: 0,
            col: 1
          },
          ['3']: {
            quoteTweetId: '4',
            row: 0,
            col: 2
          },
          ['4']: {
            quoteTweetId: '',
            row: 0,
            col: 3
          }
        }
        const input = mapObjIndexed(
          value => omit(['col', 'row'], value),
          expected
        )
        const { tweetResults } = createTreeStructure(input, '1')
        expect(tweetResults).toEqual(expected)
      })
    })

    describe('when current tweet is falsy', () => {
      it('should return input tweets', () => {
        const input = { a: { id: 'a' }, b: { id: 'b' } }

        const result = createTreeStructure(input, 'c')

        expect(result).toBe(input)
        expect(result).toEqual(input)
      })
    })
  })

  describe('createTweetReply', () => {
    const generateId = () => '3'

    describe('when the tweet has a reply already', () => {
      it('should return the newTweet with a parent and childtweet', () => {
        const parentTweet = { id: '1', replyToId: null, replyId: 2 }
        const childTweet = { id: '2', replyToId: '1', replyId: null }

        const expectedNewParentTweet = {
          id: '1',
          replyToId: null,
          replyId: '3'
        }
        const expectedNewChildTweet = { id: '2', replyToId: '3', replyId: null }
        const expectedNewTweet = {
          ...baseTweet,
          id: '3',
          replyToId: '1',
          replyId: '2'
        }

        const expected = {
          newTweet: expectedNewTweet,
          parentTweet: expectedNewParentTweet,
          childTweet: expectedNewChildTweet
        }

        const received = createTweetReply(parentTweet, childTweet, {
          generateId
        })

        expect(received).toEqual(expected)
      })
    })
    describe('when the tweet does not have a reply already', () => {
      it('should return the newTweet with a parent and no childtweet', () => {
        const parentTweet = { id: '1', replyToId: null, replyId: 2 }

        const expectedNewParentTweet = {
          id: '1',
          replyToId: null,
          replyId: '3'
        }
        const expectedNewTweet = {
          ...baseTweet,
          id: '3',
          replyToId: '1',
          replyId: null
        }

        const expected = {
          newTweet: expectedNewTweet,
          parentTweet: expectedNewParentTweet,
          childTweet: null
        }

        const received = createTweetReply(parentTweet, null, {
          generateId
        })

        expect(received).toEqual(expected)
      })
    })
  })

  describe('getAdventure', () => {
    it('should return the adventure threadName and tweets', async () => {
      const aggregateThreads = { 1: { name: 'thread 1', tweets: [] } }

      const result = await getAdventure(1, true, { aggregateThreads })

      expect(result).toEqual({ name: 'thread 1', tweets: [] })
    })

    describe('when isExample is false', () => {
      it('should call getThreadById', async () => {
        const thread = { name: 'thread 1', tweets: [] }
        // spy on getThreadById with jest.spyOn
        const getThread = jest.fn().mockResolvedValue(thread)

        const result = await getAdventure(1, false, {
          token: 'token',
          getThread
        })

        expect(result).toEqual(thread)
        expect(getThread).toHaveBeenCalledWith('token', 1)
      })
    })
  })

  describe('getBackRootDisplayTweet', () => {
    it('should return the root tweet of a quoted tweet', () => {
      const rootDisplayTweet = { id: '1', quoteParentId: '2' }
      const getTweet = simple
        .mock()
        .returnWith({ id: '2', replyToId: '3' })
        .returnWith({ id: '3', replyToId: null })

      const result = getBackRootDisplayTweet(rootDisplayTweet, getTweet)

      expect(result).toEqual({ id: '3', replyToId: null })
    })
  })

  describe('getMasterTweet', () => {
    it('should return the master tweet', () => {
      const tweets = [
        { id: '1', replyToId: '2', quoteParentId: '3' },
        { id: '2', replyToId: '3', quoteParentId: null },
        { id: '3', replyToId: null, quoteParentId: '5' },
        { id: '4', replyToId: null, quoteParentId: null }
      ]

      const result = getMasterTweet(tweets)

      expect(result).toEqual({ id: '4', replyToId: null, quoteParentId: null })
    })
  })

  describe('getQuoteTweet', () => {
    it('should return the quote tweet', () => {
      const tweet = { id: '1', quoteParentId: '2' }
      const getTweet = simple.mock().returnWith({ id: '2', text: 'tweet 2' })

      const result = getQuoteTweet(tweet, getTweet)

      expect(result).toEqual({ id: '2', text: 'tweet 2' })
    })
  })

  describe('getRootTweet', () => {
    beforeEach(() => {
      jest.resetModules()
    })

    const getTweet = jest.fn()
    const tweet = {
      id: '1',
      replyToId: '2',
      text: 'Test Tweet'
    }

    describe("when the tweet doesn't have a replyToId", () => {
      it('should return the given tweet', () => {
        const expected = { ...tweet, replyToId: null }
        const received = getRootTweet(expected, getTweet)

        expect(received).toEqual(expected)
        expect(getTweet).not.toHaveBeenCalled()
      })
    })

    describe('when the tweet has a replyToId', () => {
      it('should return the root tweet', () => {
        const expected = { id: '3', replyToId: null, text: 'lastTweet' }
        getTweet
          .mockReturnValueOnce({ id: '2', replyToId: '3' })
          .mockReturnValueOnce(expected)

        const received = getRootTweet(tweet, getTweet)

        expect(received).toEqual(expected)
        expect(getTweet).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('getTweetById', () => {
    it('should return a tweet by id', () => {
      const tweets = {
        1: { id: '1', text: 'tweet 1' },
        2: { id: '2', text: 'tweet 2' }
      }

      const getTweet = getTweetById(tweets)

      expect(getTweet('1')).toEqual({ id: '1', text: 'tweet 1' })
      expect(getTweet('2')).toEqual({ id: '2', text: 'tweet 2' })
    })
  })

  describe('isQuoted', () => {
    it('should return true if the tweet is a quote', () => {
      const tweet = { id: '1', quoteParentId: '2' }

      const result = isQuoted(tweet)

      expect(result).toEqual(true)
    })
  })

  describe('searchTweetText', () => {
    it('should return true if the tweet text matches the search', () => {
      const tweetText = 'tweet 1'

      const result = searchTweetText('tweet 1')(tweetText)

      expect(result).toEqual(true)
    })

    describe('when search string is falsy', () => {
      it('should return false', () => {
        const result = searchTweetText('')('tweet text')
        expect(result).toEqual(false)
      })
    })
  })

  describe('getUserThreads', () => {
    describe('when call is successful without twitter profile', () => {
      it('should return the user threads with default profile', async () => {
        const token = 'token'
        const additionalThread = {
          id: '2',
          name: 'thread 2',
          tweets: [],
          twitterProfile: {
            id: 'user-2',
            name: 'User Two',
            verified: false,
            username: 'userTwo'
          }
        }

        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() =>
            Promise.resolve({ data: [threadWithoutProfile, additionalThread] })
          )

        const result = await getUserThreads(token)

        expect(mockAuthorized).toHaveBeenCalledWith('threads', token)
        expect(result).toEqual([threadWithDefaultProfile, additionalThread])
      })
    })

    describe('when call is successful with twitter profile', () => {
      it('should return the user threads', async () => {
        const token = 'token'
        const additionalThread = {
          id: '2',
          name: 'thread 2',
          tweets: [],
          twitterProfile: {
            id: 'user-2',
            name: 'User Two',
            verified: false,
            username: 'userTwo'
          }
        }

        const expectedResult = [thread, additionalThread]

        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.resolve({ data: expectedResult }))

        const result = await getUserThreads(token)

        expect(mockAuthorized).toHaveBeenCalledWith('threads', token)
        expect(result).toEqual(expectedResult)
      })
    })

    it('should return null and log an error if the request.authorized fails', async () => {
      const error = new Error('error')
      const mockAuthorized = jest
        .spyOn(request, 'authorized')
        .mockImplementation(() => Promise.reject(error))

      const result = await getUserThreads('token')

      expect(result).toEqual(null)
      expect(mockAuthorized).toHaveBeenCalledWith('threads', 'token')
      expect(console.error).toHaveBeenCalledWith(
        'Fetching user threads failed',
        { error }
      )
    })
  })

  describe('updateAllThreadNodes', () => {
    it('should return the updated thread', async () => {
      const threadNodes = [
        { id: '1', text: 'tweet 1' },
        { id: '2', text: 'tweet 2' }
      ]
      const updatedThread = [
        {
          id: 'a',
          nodes: [
            { id: '1', text: 'tweet 1', col: 0, row: 0 },
            { id: '2', text: 'tweet 2', col: 0, row: 1 }
          ]
        }
      ]

      const mockAuthorized = jest
        .spyOn(request, 'authorized')
        .mockImplementation(() => Promise.resolve({ data: updatedThread }))

      const result = await updateAllThreadNodes('token', '123', threadNodes)

      expect(result).toEqual(updatedThread)
      expect(mockAuthorized).toHaveBeenCalledWith(
        'threads/123/nodes',
        'token',
        {
          body: threadNodes,
          method: 'PUT'
        }
      )
    })

    it('should return empty array when result is null', async () => {
      const threadNodes = [
        { id: '1', text: 'tweet 1' },
        { id: '2', text: 'tweet 2' }
      ]
      const updatedThread = null

      const mockAuthorized = jest
        .spyOn(request, 'authorized')
        .mockImplementation(() => Promise.resolve({ data: updatedThread }))

      const result = await updateAllThreadNodes('token', '123', threadNodes)

      //assert result is empty array and assert mockAuthorized was called with expected args.
      expect(result).toEqual([])
      expect(mockAuthorized).toHaveBeenCalledWith(
        'threads/123/nodes',
        'token',
        { body: threadNodes, method: 'PUT' }
      )
    })

    it('should return null and log an error if the request.authorized fails', async () => {
      const error = new Error('error')
      const mockAuthorized = jest
        .spyOn(request, 'authorized')
        .mockImplementation(() => Promise.reject(error))

      const result = await updateAllThreadNodes('token', '123', [])

      expect(result).toEqual(null)
      expect(mockAuthorized).toHaveBeenCalledWith(
        'threads/123/nodes',
        'token',
        {
          body: [],
          method: 'PUT'
        }
      )
      expect(console.error).toHaveBeenCalledWith('Update nodes failed', {
        error,
        threadId: '123'
      })
    })
  })

  describe('getThreadById', () => {
    describe('when request is successful without twitter profile', () => {
      it('should return the thread with default profile', async () => {
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() =>
            Promise.resolve({ data: threadWithoutProfile })
          )

        const result = await getThreadById('token', '1')

        expect(result).toEqual(threadWithDefaultProfile)

        expect(mockAuthorized).toHaveBeenCalledWith('threads/1', 'token')
      })
    })

    describe('when request is successful with twitter profile', () => {
      it('should return the thread', async () => {
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.resolve({ data: thread }))

        const result = await getThreadById('token', '1')

        expect(result).toEqual(thread)

        expect(mockAuthorized).toHaveBeenCalledWith('threads/1', 'token')
      })
    })

    describe('when request fails', () => {
      it('should return null and log an error', async () => {
        const error = new Error('error')
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.reject(error))

        const result = await getThreadById('token', '1')

        expect(result).toEqual(null)
        expect(mockAuthorized).toHaveBeenCalledWith('threads/1', 'token')
        expect(console.error).toHaveBeenCalledWith(
          'Fetching thread by id failed',
          {
            error,
            threadId: '1'
          }
        )
      })
    })
  })

  describe('deleteThread', () => {
    describe('when request is successful', () => {
      it('should return true', async () => {
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.resolve())

        const result = await deleteThread('token', '1')

        expect(result).toBe(true)
        expect(mockAuthorized).toHaveBeenCalledWith('threads/1', 'token', {
          contentType: null,
          method: 'DELETE'
        })
      })
    })

    describe('when request fails', () => {
      it('should return null and log an error', async () => {
        const error = new Error('error')
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.reject(error))

        const result = await deleteThread('token', '1')

        expect(result).toEqual(null)
        expect(mockAuthorized).toHaveBeenCalledWith('threads/1', 'token', {
          contentType: null,
          method: 'DELETE'
        })
        expect(console.error).toHaveBeenCalledWith('Deleting thread failed', {
          error,
          threadId: '1'
        })
      })
    })
  })

  describe('createThread', () => {
    describe('when request is successful without twitter profile', () => {
      it('should return the thread with default profile', async () => {
        const inputThread = {
          name: 'thread',
          description: 'thread description',
          twitterId: '123'
        }
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() =>
            Promise.resolve({ data: threadWithoutProfile })
          )

        const result = await createThread('token', {
          ...inputThread,
          otherProp: 12
        })

        expect(result).toEqual(threadWithDefaultProfile)
        expect(mockAuthorized).toHaveBeenCalledWith('threads', 'token', {
          body: inputThread,
          method: 'POST'
        })
      })
    })

    describe('when request is successful with twitter profile', () => {
      it('should return the thread', async () => {
        const inputThread = {
          name: 'thread',
          description: 'thread description',
          twitterId: '123'
        }
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.resolve({ data: thread }))

        const result = await createThread('token', {
          ...inputThread,
          otherProp: 12
        })

        expect(result).toEqual(thread)
        expect(mockAuthorized).toHaveBeenCalledWith('threads', 'token', {
          body: inputThread,
          method: 'POST'
        })
      })
    })

    describe('when request fails', () => {
      it('should return null and log an error', async () => {
        const inputThread = {
          name: 'thread',
          description: 'thread description',
          twitterId: '123'
        }
        const error = new Error('error')
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.reject(error))

        const result = await createThread('token', inputThread)

        expect(result).toEqual(null)
        expect(mockAuthorized).toHaveBeenCalledWith('threads', 'token', {
          body: inputThread,
          method: 'POST'
        })
        expect(console.error).toHaveBeenCalledWith('Creating thread failed', {
          error,
          thread: inputThread
        })
      })
    })
  })

  describe('updateThread', () => {
    describe('when request is successful without twitter profile', () => {
      it('should return the thread with default profile', async () => {
        const inputThread = {
          name: 'thread',
          description: 'thread description',
          twitterId: '123'
        }
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() =>
            Promise.resolve({ data: threadWithoutProfile })
          )

        const result = await updateThread('token', {
          ...inputThread,
          id: 'abc'
        })

        expect(result).toEqual(threadWithDefaultProfile)
        expect(mockAuthorized).toHaveBeenCalledWith('threads/abc', 'token', {
          body: inputThread,
          method: 'PUT'
        })
      })
    })

    describe('when request is successful with twitter profile', () => {
      it('should return the thread', async () => {
        const inputThread = {
          name: 'thread',
          description: 'thread description',
          twitterId: '123'
        }
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.resolve({ data: thread }))

        const result = await updateThread('token', {
          ...inputThread,
          id: 'abc'
        })

        expect(result).toEqual(thread)
        expect(mockAuthorized).toHaveBeenCalledWith('threads/abc', 'token', {
          body: inputThread,
          method: 'PUT'
        })
      })
    })

    describe('when request fails', () => {
      it('should return null and log an error', async () => {
        const sanitizedThread = {
          name: 'thread',
          description: 'thread description',
          twitterId: '123'
        }
        const inputThread = {
          ...sanitizedThread,
          id: 'abc'
        }
        const error = new Error('error')
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.reject(error))

        const result = await updateThread('token', inputThread)

        expect(result).toEqual(null)
        expect(mockAuthorized).toHaveBeenCalledWith('threads/abc', 'token', {
          body: sanitizedThread,
          method: 'PUT'
        })
        expect(console.error).toHaveBeenCalledWith('Updating thread failed', {
          error,
          thread: inputThread
        })
      })
    })
  })

  describe('duplicateThread', () => {
    describe('when request is successful without twitter profile', () => {
      it('should return the thread with default profile', async () => {
        const inputThread = {
          name: 'thread',
          description: 'thread description',
          twitterId: '123'
        }
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() =>
            Promise.resolve({ data: threadWithoutProfile })
          )

        const result = await duplicateThread('token', {
          ...inputThread,
          id: 'abc'
        })

        expect(result).toEqual(threadWithDefaultProfile)
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/abc/duplicate',
          'token',
          {
            body: inputThread,
            method: 'POST'
          }
        )
      })
    })

    describe('when request is successful with twitter profile', () => {
      it('should return the thread', async () => {
        const inputThread = {
          name: 'thread',
          description: 'thread description',
          twitterId: '123'
        }
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.resolve({ data: thread }))

        const result = await duplicateThread('token', {
          ...inputThread,
          id: 'abc'
        })

        expect(result).toEqual(thread)
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/abc/duplicate',
          'token',
          {
            body: inputThread,
            method: 'POST'
          }
        )
      })
    })

    describe('when request fails', () => {
      it('should return null and log an error', async () => {
        const sanitizedThread = {
          name: 'thread',
          description: 'thread description',
          twitterId: '123'
        }
        const inputThread = {
          ...sanitizedThread,
          id: 'abc'
        }
        const error = new Error('error')
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.reject(error))

        const result = await duplicateThread('token', inputThread)

        expect(result).toEqual(null)
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/abc/duplicate',
          'token',
          {
            body: sanitizedThread,
            method: 'POST'
          }
        )
        expect(console.error).toHaveBeenCalledWith('Updating thread failed', {
          error,
          thread: inputThread
        })
      })
    })
  })

  describe('finalizeThread', () => {
    describe('when request is successful without twitter profile', () => {
      it('should return valid as true and the thread with default profile', async () => {
        const expectedResult = {
          valid: true,
          data: threadWithDefaultProfile
        }
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() =>
            Promise.resolve({ status: 200, data: threadWithoutProfile })
          )

        const result = await finalizeThread('token', '1')

        expect(result).toEqual(expectedResult)
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/1/finalize',
          'token',
          { method: 'POST' }
        )
      })
    })

    describe('when request is successful with twitter profile', () => {
      it('should return valid as true and the thread', async () => {
        const expectedResult = {
          valid: true,
          data: thread
        }
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() =>
            Promise.resolve({ status: 200, data: thread })
          )

        const result = await finalizeThread('token', '1')

        expect(result).toEqual(expectedResult)
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/1/finalize',
          'token',
          { method: 'POST' }
        )
      })
    })

    describe('when request fails', () => {
      it('should return valid as false and log an error', async () => {
        const error = new Error('error')
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.reject(error))

        const result = await finalizeThread('token', '1')

        expect(result).toEqual({ valid: false })
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/1/finalize',
          'token',
          { method: 'POST' }
        )
        expect(console.error).toHaveBeenCalledWith('Finalizing thread failed', {
          error,
          threadId: '1'
        })
      })
    })

    describe('when a bad request is returned', () => {
      it('should return valid as false with errors', async () => {
        const errors = [{ message: 'error' }]
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() =>
            Promise.resolve({ status: 400, data: { errors } })
          )

        const result = await finalizeThread('token', '1')

        expect(result).toEqual({ valid: false, errors })
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/1/finalize',
          'token',
          { method: 'POST' }
        )
      })
    })
  })

  describe('unlockThread', () => {
    describe('when request is successful without twitter profile', () => {
      it('should return the thread with default profile', async () => {
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() =>
            Promise.resolve({ data: threadWithoutProfile })
          )

        const result = await unlockThread('token', '1')

        expect(result).toEqual(threadWithDefaultProfile)
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/1/unlock',
          'token',
          { method: 'POST' }
        )
      })
    })

    describe('when request is successful with twitter profile', () => {
      it('should return the thread', async () => {
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.resolve({ data: thread }))

        const result = await unlockThread('token', '1')

        expect(result).toEqual(thread)
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/1/unlock',
          'token',
          { method: 'POST' }
        )
      })
    })

    describe('when request fails', () => {
      it('should return null and log an error', async () => {
        const error = new Error('error')
        const mockAuthorized = jest
          .spyOn(request, 'authorized')
          .mockImplementation(() => Promise.reject(error))

        const result = await unlockThread('token', '1')

        expect(result).toEqual(null)
        expect(mockAuthorized).toHaveBeenCalledWith(
          'threads/1/unlock',
          'token',
          { method: 'POST' }
        )
        expect(console.error).toHaveBeenCalledWith(
          'Unlocking finalised thread failed',
          {
            error,
            threadId: '1'
          }
        )
      })
    })
  })

  describe('createLinkBackTweet', () => {
    it('should return a link back tweet', () => {
      const tweet = { id: '1', text: 'tweet 1' }
      const backTweetId = '2'

      const result = createLinkBackTweet(tweet, backTweetId)

      expect(result).toEqual({
        ...tweet,
        quoteTweetId: backTweetId,
        isQuoteBack: true
      })
    })
  })

  describe('removeBackLink', () => {
    it('should return a link back tweet', () => {
      const tweet = { id: '1', text: 'tweet 1' }

      const result = removeBackLink(tweet)

      expect(result).toEqual({
        ...tweet,
        quoteTweetId: null,
        isQuoteBack: false
      })
    })
  })

  describe('createQuoteTweet', () => {
    it('should return a quote tweet', () => {
      const tweet = { id: '1', text: 'tweet 1' }
      const quoteTweetId = '2'
      const generateId = jest.fn().mockReturnValue(quoteTweetId)

      const { newTweet, parentTweet } = createQuoteTweet(
        tweet,
        { images: ['some-image'] },
        {
          generateId,
          defaultTweet: {
            videos: ['some-video']
          }
        }
      )

      expect(newTweet).toEqual({
        id: quoteTweetId,
        quoteParentId: '1',
        videos: ['some-video'],
        images: ['some-image']
      })

      expect(parentTweet).toEqual({
        ...tweet,
        quoteTweetId,
        isQuoteBack: false
      })
    })
  })

  describe('getInitialTweets', () => {
    it('should return an array with the initial tweet', () => {
      const generateId = jest.fn().mockReturnValue('1')

      const result = getInitialTweets({ generateId })

      expect(result).toEqual([
        {
          id: '1',
          text: 'Parent Post',
          images: [],
          videos: [],
          replyId: null,
          replyToId: null,
          quoteTweetId: null,
          quoteParentId: null
        }
      ])
    })
  })

  describe('getReplyTweetIds', () => {
    it('should return tweet with all replies and quotes ', () => {
      const tweet = { id: '1', replyId: '2', quoteTweetId: '7' }
      const replyTweets = [
        { id: '2', replyId: '3' },
        { id: '3', replyId: '4', quoteTweetId: '5' },
        { id: '4' }
      ]

      const quoteTweets = [{ id: '5', replyId: '6' }, { id: '6' }]
      const parentQuoteTweets = [{ id: '7', replyId: '8' }, { id: '8' }]

      const allTweets = [
        tweet,
        ...replyTweets,
        ...quoteTweets,
        ...parentQuoteTweets
      ]

      const tweetDict = allTweets.reduce(
        (acc, tweet) => ({
          ...acc,
          [tweet.id]: tweet
        }),
        {}
      )

      const getTweet = jest.fn(id => tweetDict[id])

      const result = getReplyTweetIds(tweet, getTweet)

      expect(result.sort((a, b) => (+a < +b ? -1 : 1))).toEqual(
        allTweets.map(prop('id'))
      )
    })
  })

  describe('processQuotes', () => {
    it('should return tweet with all replies and quotes ', () => {
      const tweet = { id: '1', replyId: '2', quoteTweetId: '7' }
      const replyTweets = [
        { id: '2', replyId: '3' },
        { id: '3', replyId: '4', quoteTweetId: '5' },
        { id: '4' }
      ]

      const quoteTweets = [{ id: '5', replyId: '6' }, { id: '6' }]
      const parentQuoteTweets = [{ id: '7', replyId: '8' }, { id: '8' }]

      const allTweets = [
        tweet,
        ...replyTweets,
        ...quoteTweets,
        ...parentQuoteTweets
      ]

      const tweetDict = allTweets.reduce(
        (acc, tweet) => ({
          ...acc,
          [tweet.id]: tweet
        }),
        {}
      )

      const getTweet = jest.fn(id => tweetDict[id])

      const result = processQuotes(tweet, getTweet)

      expect(result.sort((a, b) => (+a < +b ? -1 : 1))).toEqual(
        allTweets.map(prop('id'))
      )
    })

    describe('when tweet has no quoteTweetId', () => {
      it('should return all reply tweet ids', () => {
        const tweet = { id: '1', replyId: '2' }
        const replyTweets = [{ id: '2', replyId: '3' }, { id: '3' }]

        const allTweets = [tweet, ...replyTweets]

        const tweetDict = allTweets.reduce(
          (acc, tweet) => ({
            ...acc,
            [tweet.id]: tweet
          }),
          {}
        )

        const getTweet = jest.fn(id => tweetDict[id])

        const result = processQuotes(tweet, getTweet)

        expect(result.sort((a, b) => (+a < +b ? -1 : 1))).toEqual(
          allTweets.map(prop('id'))
        )
      })
    })

    describe('when tweet has no replyId', () => {
      it('should return all quote tweet ids', () => {
        const tweet = { id: '1', quoteTweetId: '2' }
        const quoteTweets = [{ id: '2', quoteTweetId: '3' }, { id: '3' }]

        const allTweets = [tweet, ...quoteTweets]

        const tweetDict = allTweets.reduce(
          (acc, tweet) => ({
            ...acc,
            [tweet.id]: tweet
          }),
          {}
        )

        const getTweet = jest.fn(id => tweetDict[id])

        const result = processQuotes(tweet, getTweet)

        expect(result.sort((a, b) => (+a < +b ? -1 : 1))).toEqual(
          allTweets.map(prop('id'))
        )
      })
    })

    describe('when tweet is quote back tweet', () => {
      it('should not return quote tweet ids', () => {
        const tweet = { id: '1', quoteTweetId: '2', isQuoteBack: true }
        const quoteTweets = [{ id: '2', quoteTweetId: '3' }, { id: '3' }]

        const allTweets = [tweet, ...quoteTweets]

        const tweetDict = allTweets.reduce(
          (acc, tweet) => ({
            ...acc,
            [tweet.id]: tweet
          }),
          {}
        )

        const getTweet = jest.fn(id => tweetDict[id])

        const result = processQuotes(tweet, getTweet)

        expect(result).toEqual(['1'])
      })
    })
  })

  // TODO: Add tests for the following methods
  describe('deleteTweetAndFixConnections', () => {})
  describe('getTweetBreadcrumbs', () => {})
  describe('sanitizeLoadedThread', () => {})
  describe('sanitizeLoadedThreads', () => {})
})
