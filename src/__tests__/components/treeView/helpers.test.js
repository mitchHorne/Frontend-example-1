import {
  getNodeRelations,
  hasOneWayQuoteLink
} from '../../../components/treeView/helpers'

describe('TreeView helpers', () => {
  describe('getNodeRelations', () => {
    describe('when replyToId has a value', () => {
      it('should return reply relation', async () => {
        const replyToId = '1'
        const result = getNodeRelations({ replyToId })

        expect(result).toEqual([
          {
            targetId: replyToId,
            sourceAnchor: 'top',
            targetAnchor: 'bottom'
          }
        ])
      })
    })

    describe('when quoteParentId has a value', () => {
      it('should return quote relation', async () => {
        const quoteParentId = '1'
        const result = getNodeRelations({ quoteParentId })

        expect(result).toEqual([
          {
            targetId: quoteParentId,
            sourceAnchor: 'left',
            targetAnchor: 'right'
          }
        ])
      })
    })

    describe('when tweet has one way quote link', () => {
      it('should return backwards link relation', async () => {
        const quoteTweetId = '3'
        const result = getNodeRelations({
          id: '2',
          quoteTweetId,
          isQuoteBack: true
        })

        expect(result).toEqual([
          {
            targetId: quoteTweetId,
            targetAnchor: 'bottom',
            sourceAnchor: 'top',
            style: {
              strokeDasharray: '5,5'
            }
          }
        ])
      })
    })
  })

  describe('hasOneWayQuoteLink', () => {
    describe('when there is no quoteTweet', () => {
      it('should return false', async () => {
        const result = hasOneWayQuoteLink('2', null)
        expect(result).toBe(false)
      })
    })

    describe('when quoteParentId is not equal to tweetId', () => {
      it('should return true', async () => {
        const quoteParentId = '1'
        const result = hasOneWayQuoteLink('2', { quoteParentId })
        expect(result).toBe(true)
      })
    })

    describe('when quoteParentId is equal to tweetId', () => {
      it('should return false', async () => {
        const quoteParentId = '1'
        const result = hasOneWayQuoteLink('1', { quoteParentId })
        expect(result).toBe(false)
      })
    })
  })
})
