import { render } from '@testing-library/react'
import { TvButton } from '../../components'

describe('TvButton', () => {
  it('should render correctly', () => {
    const { getByText } = render(<TvButton>test button</TvButton>)
    expect(getByText('test button')).toBeTruthy()
    expect(getByText('test button')).toBeInstanceOf(HTMLButtonElement)
  })
})
