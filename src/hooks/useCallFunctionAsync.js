import { useState } from 'react'

/**
 * This hook is used to call an async function, and prevent calling it again until the previous call is finished.
 * It returns an array with two elements:
 * 1. The first element is the function to call the async function.
 * 2. The second element is a boolean indicating whether the async function is busy.
 *
 * @param {function(...any): Promise<any>} callFunctionAsync
 * @returns {[function(...any): Promise<any>, boolean]}
 * @example
 * const [callEndpoint, isBusy] = useCallFunctionAsync(async (arg1, arg2) => {
 *  const result = await fetch('https://example.com', {
 *   method: 'POST',
 *   body: JSON.stringify({ arg1, arg2 })
 * })
 *
 * const arg1 = 'foo'
 * const arg2 = 'bar'
 * await callEndpoint(arg1, arg2)
 */
export const useCallFunctionAsync = callFunctionAsync => {
  const [isBusy, setIsBusy] = useState(false)

  const handleCallEndpoint = async (...props) => {
    if (isBusy) return new Promise(() => {})

    setIsBusy(true)
    const result = await callFunctionAsync(...props)
    setIsBusy(false)

    return result
  }

  return [handleCallEndpoint, isBusy]
}
