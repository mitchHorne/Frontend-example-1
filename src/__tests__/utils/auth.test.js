import { getIsUserAdmin, login } from '../../utils/auth'
import * as request from '../../utils/request'

describe('auth utils', () => {
  describe('getIsUserAdmin', () => {})

  describe('login', () => {
    const mockedAuthorized = jest.fn()
    const token = 'some-token'

    beforeEach(() => {
      jest.spyOn(request, 'authorized').mockImplementation(mockedAuthorized)
    })

    afterEach(() => {
      mockedAuthorized.mockReset()
    })

    it('should return "Authorized" for valid credentials', async () => {
      const expectedResult = { data: 'data result' }
      mockedAuthorized.mockReturnValue(expectedResult)

      const result = await login(token)

      expect(result).toEqual(expectedResult.data)
      expect(request.authorized).toHaveBeenCalledWith('signin', token, {
        method: 'POST'
      })
    })

    it('should throw an error for invalid credentials', async () => {
      mockedAuthorized.mockRejectedValue(new Error('Invalid credentials'))

      const result = await login(token)

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('getIsUserAdmin', () => {
    it('should return true for a user with the "admin" role', () => {
      const inputObject = { roles: ['admin', 'client'] }

      const result = getIsUserAdmin(inputObject)

      expect(result).toBe(true)
    })

    it('should return false for a user without the "admin" role', () => {
      const inputObject = { roles: ['client'] }

      const result = getIsUserAdmin(inputObject)

      expect(result).toBe(false)
    })

    it('should return false for a user with an empty roles array', () => {
      const inputObject = { roles: [] }

      const result = getIsUserAdmin(inputObject)

      expect(result).toBe(false)
    })

    it('should return false for a user with an undefined roles array', () => {
      const inputObject = { roles: undefined }

      const result = getIsUserAdmin(inputObject)

      expect(result).toBe(false)
    })
  })
})
