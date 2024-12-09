import { joinPaths, trimByChar, tweetCanLinkBack } from '../../utils/misc'

describe('misc', () => {
  describe('joinPaths', () => {
    it('should join paths', () => {
      expect(joinPaths('foo', 'bar')).toBe('foo/bar')
    })

    it('should trim slashes', () => {
      expect(joinPaths('/foo/', '/bar/')).toBe('foo/bar')
    })
  })

  describe('trimByChar', () => {
    it('should trim slashes', () => {
      expect(trimByChar('/', '/foo/')).toBe('foo')
    })

    it('should trim other sign', () => {
      expect(trimByChar('\\+', '+foo+')).toBe('foo')
    })
  })

  describe('tweetCanLinkBack', () => {
    describe('when all conditions are met', () => {
      it('should return true', () => {
        const selectedTweet = {
          id: 'a',
          row: 1
        }
        const quotedTweet = {
          quoteTweetId: 'b',
          row: 2
        }

        expect(tweetCanLinkBack(selectedTweet, quotedTweet)).toEqual(true)
      })
    })

    describe('when the tweet ids are the same', () => {
      it('should return false', () => {
        const selectedTweet = {
          id: 'a',
          row: 1
        }
        const quotedTweet = {
          quoteTweetId: 'a',
          row: 2
        }

        expect(tweetCanLinkBack(selectedTweet, quotedTweet)).toEqual(false)
      })
    })

    describe('when the selected tweet row is 0', () => {
      it('should return false', () => {
        const selectedTweet = {
          id: 'a',
          row: 0
        }
        const quotedTweet = {
          quoteTweetId: 'b',
          row: 2
        }

        expect(tweetCanLinkBack(selectedTweet, quotedTweet)).toEqual(false)
      })
    })

    describe('when the tweet rows are the same', () => {
      it('should return false', () => {
        const selectedTweet = {
          id: 'a',
          row: 1
        }
        const quotedTweet = {
          quoteTweetId: 'b',
          row: 1
        }

        expect(tweetCanLinkBack(selectedTweet, quotedTweet)).toEqual(false)
      })
    })
  })
})
