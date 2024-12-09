import { useState } from 'react'
import { useCallFunctionAsync } from '../../hooks'
import { render, waitFor } from '@testing-library/react'

describe('useCallFunctionAsync', () => {
  const args = ['some argument', 'other']
  const expectedResult = 'asd'

  // eslint-disable-next-line react/prop-types
  const UseCallFunctionAsyncComponent = ({ inputArgs, asyncFunction }) => {
    const [functionResult, setFunctionResult] = useState(null)
    const [hookFunction, isBusy] = useCallFunctionAsync(async () => {
      setFunctionResult(await asyncFunction(...inputArgs))
    })

    return (
      <>
        <div data-testid='isBusy'>{isBusy ? 'true' : 'false'}</div>
        <div data-testid='functionResult'>{JSON.stringify(functionResult)}</div>

        <button data-testid='button' onClick={hookFunction}>
          Call function
        </button>
      </>
    )
  }

  it('should return async function and isBusy bool', async () => {
    const asyncFunction = jest.fn().mockResolvedValue(expectedResult)

    const { getByTestId } = render(
      <UseCallFunctionAsyncComponent
        inputArgs={args}
        asyncFunction={asyncFunction}
      />
    )

    const button = getByTestId('button')
    button.click()

    await waitFor(() => {
      const isBusy = getByTestId('isBusy').textContent
      expect(isBusy).toEqual('true')
    })

    await waitFor(() => {
      const isBusy = getByTestId('isBusy').textContent
      expect(isBusy).toEqual('false')
    })

    const result = getByTestId('functionResult').textContent
    expect(result).toEqual('"asd"')

    expect(asyncFunction).toHaveBeenCalledTimes(1)
    expect(asyncFunction).toHaveBeenCalledWith(...args)
  })

  describe('when async function is called multiple times', () => {
    it('should call function one time only', async () => {
      const asyncFunction = jest.fn().mockImplementation(async () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(expectedResult)
          }, 500)
        })
      })

      const { getByTestId } = render(
        <UseCallFunctionAsyncComponent
          inputArgs={args}
          asyncFunction={asyncFunction}
        />
      )

      const button = getByTestId('button')
      button.click()

      await waitFor(() => {
        const isBusy = getByTestId('isBusy').textContent
        expect(isBusy).toEqual('true')
      })

      button.click()
      button.click()
      button.click()

      await waitFor(() => {
        const isBusy = getByTestId('isBusy').textContent
        expect(isBusy).toEqual('false')
      })

      const result = getByTestId('functionResult').textContent
      expect(result).toEqual('"asd"')

      expect(asyncFunction).toHaveBeenCalledTimes(1)
      expect(asyncFunction).toHaveBeenCalledWith(...args)
    })
  })
})
