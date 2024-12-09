import { join } from 'ramda'
import {
  getThreadExportFileName,
  getThreadExportJson
} from '../../utils/threadExport'

describe('utils/threadExport', () => {
  describe('getThreadExportJson', () => {
    it('should remove isQuoteBack prop and stringify tweets', () => {
      const tweets = [
        {
          id: '1',
          text: 'tweet 1',
          images: ['image 1'],
          videos: [],
          replyId: '2',
          replyToId: '3',
          quoteTweetId: null,
          quoteParentId: null
        },
        {
          id: '4',
          text: 'tweet 4',
          isQuoteBack: true
        }
      ]

      const result = getThreadExportJson(tweets)

      const expected = join('\n', [
        '[',
        '  {',
        '    "id": "1",',
        '    "text": "tweet 1",',
        '    "images": [',
        '      "image 1"',
        '    ],',
        '    "videos": [],',
        '    "replyId": "2",',
        '    "replyToId": "3",',
        '    "quoteTweetId": null,',
        '    "quoteParentId": null',
        '  },',
        '  {',
        '    "id": "4",',
        '    "text": "tweet 4"',
        '  }',
        ']'
      ])

      expect(result).toEqual(expected)
    })
  })

  describe('getThreadExportFileName', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date(2021, 1, 3, 4, 5, 6))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should take the first 100 characters, trim and append the date', () => {
      const expectedNamePrefix = 'a'.repeat(99)
      const name = `${expectedNamePrefix} ${'b'.repeat(100)}`

      const result = getThreadExportFileName({ name })

      expect(result).toEqual(`${expectedNamePrefix} - 20210203_040506.json`)
    })

    describe('when name is falsy', () => {
      it('should default to "thread-export"', () => {
        const result = getThreadExportFileName({})

        expect(result).toEqual('thread-export - 20210203_040506.json')
      })
    })
  })
})
