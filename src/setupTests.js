// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

beforeEach(() => {
  jest.clearAllMocks()

  console.error = jest.fn()
})

beforeAll(() => {
  Object.defineProperty(global.self, 'crypto', {
    value: {
      getRandomValues: arr => crypto.randomBytes(arr.length)
    }
  })
  global.crypto.subtle = {}
})
