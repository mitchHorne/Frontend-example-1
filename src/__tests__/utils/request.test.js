import { authorized, unauthorized } from '../../utils/request'

describe('request', () => {
  describe('unauthorized', () => {
    beforeEach(() => {
      jest.spyOn(global, 'fetch')
    })

    afterEach(() => {
      global.fetch.mockRestore()
    })

    it('should return JSON data when content type is "application/json"', async () => {
      const path = '/api/data'
      const contentType = 'application/json'
      const inputObject = {
        body: { prop: 'value' }
      }

      const mockResponse = { data: 'mock data' }
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
        headers: { get: () => contentType }
      })

      const result = await unauthorized(path, inputObject)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(path, {
        headers: {
          'Content-Type': contentType
        },
        method: 'GET',
        mode: 'cors',
        body: '{"prop":"value"}'
      })
    })

    it('should return the raw response when content type is not "application/json"', async () => {
      const path = '/api/data'
      const contentType = 'text/html'
      const inputObject = {
        contentType
      }

      const mockResponse = { data: 'some data' }
      global.fetch.mockResolvedValue(mockResponse)

      const result = await unauthorized(path, inputObject)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(path, {
        headers: {
          'Content-Type': contentType
        },
        method: 'GET',
        mode: 'cors'
      })
    })

    it('should throw an error when the fetch call fails', async () => {
      const path = '/api/data'

      const mockError = new Error('mock error')
      global.fetch.mockRejectedValue(mockError)

      await expect(unauthorized(path)).rejects.toThrow(mockError)
      expect(global.fetch).toHaveBeenCalledWith(path, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        mode: 'cors'
      })
    })
  })

  describe('authorized', () => {
    const token = 'some-token'

    beforeEach(() => {
      jest.spyOn(global, 'fetch')
    })

    afterEach(() => {
      global.fetch.mockRestore()
    })

    it('should return JSON data when content type is "application/json"', async () => {
      const path = '/api/data'
      const contentType = 'application/json'
      const inputObject = {
        body: { prop: 'value' }
      }

      const mockResponse = { data: 'mock data' }
      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
        headers: { get: () => contentType }
      })

      const result = await authorized(path, token, inputObject)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(path, {
        headers: {
          Authorization: 'Bearer some-token',
          'Content-Type': contentType
        },
        method: 'GET',
        mode: 'cors',
        body: '{"prop":"value"}'
      })
    })

    it('should return the raw response when content type is not "application/json"', async () => {
      const path = '/api/data'
      const contentType = 'text/html'
      const inputObject = {
        contentType
      }

      const mockResponse = { data: 'some data' }
      global.fetch.mockResolvedValue(mockResponse)

      const result = await authorized(path, token, inputObject)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(path, {
        headers: {
          Authorization: 'Bearer some-token',
          'Content-Type': contentType
        },
        method: 'GET',
        mode: 'cors'
      })
    })

    it('should throw an error when the fetch call fails', async () => {
      const path = '/api/data'

      const mockError = new Error('mock error')
      global.fetch.mockRejectedValue(mockError)

      await expect(authorized(path, token)).rejects.toThrow(mockError)
      expect(global.fetch).toHaveBeenCalledWith(path, {
        headers: {
          Authorization: 'Bearer some-token',
          'Content-Type': 'application/json'
        },
        method: 'GET',
        mode: 'cors'
      })
    })
  })
})
