import { render } from '@testing-library/react'
import { TweetUserHandle } from '../../../components'

describe('TweetUserHandle', () => {
  it('should render user name and handle', () => {
    const name = 'John Smith'
    const handle = 'johnnyBoy'

    const { getByText } = render(
      <TweetUserHandle name={name} handle={handle} />
    )

    expect(getByText(name)).toBeInTheDocument()
    expect(getByText(`@${handle}`)).toBeInTheDocument()
  })
})
