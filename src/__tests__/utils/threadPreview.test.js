import {
  getSharedThreadPreview,
  prepareThreadPreview,
  upsertSharedThreadPreview,
  viewSharedThreadPreview
} from '../../utils/threadPreview'
import * as request from '../../utils/request'

describe('threadPreview', () => {
  beforeEach(() => {
    process.env.REACT_APP_BASE_URL = 'http://my-base-url'
  })

  afterAll(() => {
    process.env.REACT_APP_BASE_URL = ''
  })

  describe('prepareThreadPreview', () => {
    it('should return thread preview with url', () => {
      const inputPreview = {
        createdAt: 1000,
        expiresAt: 2000,
        code: 'preview-code'
      }

      const result = prepareThreadPreview(inputPreview)

      expect(result).toEqual({
        previewUrl: 'http://my-base-url/preview/preview-code',
        createdAt: 1000,
        expiresAt: 2000,
        code: 'preview-code'
      })
    })

    describe('when preview response is falsy', () => {
      it('should return null', () => {
        expect(prepareThreadPreview(null)).toBeNull()
      })
    })

    describe('when preview response code is falsy', () => {
      it('should return null', () => {
        expect(prepareThreadPreview({ code: null })).toBeNull()
      })
    })
  })

  describe('getSharedThreadPreview', () => {
    const token = 'token'
    const threadId = 'thread-id'

    it('should return prepared preview', async () => {
      const preview = { code: 'code' }

      jest.spyOn(request, 'authorized').mockResolvedValue({ data: preview })

      const result = await getSharedThreadPreview(token, threadId)

      expect(request.authorized).toHaveBeenCalledTimes(1)
      expect(request.authorized).toHaveBeenCalledWith(
        '/threads/thread-id/share-preview',
        token
      )

      expect(result).toEqual({
        code: 'code',
        previewUrl: 'http://my-base-url/preview/code'
      })
    })

    describe('when an error occurs', () => {
      it('should log an error and return null', async () => {
        const error = new Error('failed error')
        jest.spyOn(request, 'authorized').mockRejectedValue(error)

        const result = await getSharedThreadPreview(token, threadId)

        expect(request.authorized).toHaveBeenCalledTimes(1)
        expect(request.authorized).toHaveBeenCalledWith(
          '/threads/thread-id/share-preview',
          token
        )

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(
          'Fetching shared thread preview failed',
          { error }
        )

        expect(result).toBeNull()
      })
    })
  })

  describe('upsertSharedThreadPreview', () => {
    const token = 'token'
    const threadId = 'thread-id'
    const password = 'password'

    it('should return prepared preview', async () => {
      const preview = { code: 'code' }

      jest.spyOn(request, 'authorized').mockResolvedValue({ data: preview })

      const result = await upsertSharedThreadPreview(token, threadId, password)

      expect(request.authorized).toHaveBeenCalledTimes(1)
      expect(request.authorized).toHaveBeenCalledWith(
        '/threads/thread-id/share-preview',
        token,
        { method: 'POST', body: { data: password } }
      )

      expect(result).toEqual({
        code: 'code',
        previewUrl: 'http://my-base-url/preview/code'
      })
    })

    describe('when an error occurs', () => {
      it('should log an error and return null', async () => {
        const error = new Error('failed error')
        jest.spyOn(request, 'authorized').mockRejectedValue(error)

        const result = await upsertSharedThreadPreview(
          token,
          threadId,
          password
        )

        expect(request.authorized).toHaveBeenCalledTimes(1)
        expect(request.authorized).toHaveBeenCalledWith(
          '/threads/thread-id/share-preview',
          token,
          { method: 'POST', body: { data: password } }
        )

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(
          'Creating shared thread preview failed',
          { error }
        )

        expect(result).toBeNull()
      })
    })
  })

  describe('viewSharedThreadPreview', () => {
    const previewId = 'preview-id'
    const password = 'password'

    it('should return prepared preview', async () => {
      const thread = { id: 'thread-id', name: 'thread-name' }

      jest.spyOn(request, 'unauthorized').mockResolvedValue({ data: thread })

      const result = await viewSharedThreadPreview(previewId, password)

      expect(request.unauthorized).toHaveBeenCalledTimes(1)
      expect(request.unauthorized).toHaveBeenCalledWith('/preview/preview-id', {
        method: 'POST',
        body: { data: password }
      })

      expect(result).toEqual({
        id: 'thread-id',
        name: 'thread-name'
      })
    })

    describe('when an error occurs', () => {
      it('should log an error and return null', async () => {
        const error = new Error('failed error')
        jest.spyOn(request, 'unauthorized').mockRejectedValue(error)

        const result = await viewSharedThreadPreview(previewId, password)

        expect(request.unauthorized).toHaveBeenCalledTimes(1)
        expect(request.unauthorized).toHaveBeenCalledWith(
          '/preview/preview-id',
          { method: 'POST', body: { data: password } }
        )

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(
          'Viewing shared thread preview failed',
          { error }
        )

        expect(result).toBeNull()
      })
    })
  })
})
