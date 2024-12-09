import { render } from '@testing-library/react'
import { ThreadMenuComponent } from '../../components'
import { wrapPageElement } from '../../testUtils'

describe('ThreadMenu', () => {
  it('should render without crashing', () => {
    render(<ThreadMenuComponent threads={[]} heading='' />)
  })

  it('should render input thread options', () => {
    const threads = [
      {
        id: '1',
        name: 'example1',
        description: 'example one',
        twitterProfile: {}
      },
      {
        id: '2',
        name: 'example2',
        description: 'example two',
        twitterProfile: {}
      }
    ]

    const { getByTestId, getByText, queryByTestId } = render(
      wrapPageElement(ThreadMenuComponent, { threads, heading: 'Thread Menu' })
    )

    expect(queryByTestId('thread-picture-example1}')).not.toBeInTheDocument()
    expect(getByTestId('thread-option-1')).toBeInTheDocument()

    expect(queryByTestId('thread-picture-example2')).not.toBeInTheDocument()
    expect(getByTestId('thread-option-2')).toBeInTheDocument()

    expect(getByText(threads[0].name)).toBeInTheDocument()
    expect(getByText(threads[0].description)).toBeInTheDocument()

    expect(getByText(threads[1].name)).toBeInTheDocument()
    expect(getByText(threads[1].description)).toBeInTheDocument()
  })

  describe('when thread has picture', () => {
    it('should render picture', () => {
      const threads = [
        {
          id: '1',
          name: 'example1',
          description: 'example one',
          twitterProfile: {
            profileImageUrl: 'some_pic'
          }
        }
      ]

      const { getByTestId } = render(
        wrapPageElement(ThreadMenuComponent, {
          threads,
          heading: 'Thread Menu'
        })
      )

      expect(getByTestId('thread-picture-example1')).toBeInTheDocument()
    })
  })
})
