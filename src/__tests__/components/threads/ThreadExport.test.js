import { render, waitFor } from '@testing-library/react'
import { ThreadExport } from '../../../components'
import { join } from 'ramda'
import * as fileUtils from '../../../utils/file'
import * as threadExport from '../../../utils/threadExport'

describe('ThreadExport', () => {
  it('should render without crashing', () => {
    render(<ThreadExport thread={{}} tweets={[]} />)
  })

  it('should render expected json preview', () => {
    const tweets = [{ id: '1', text: 'tweet 1' }]

    const { getByTestId } = render(<ThreadExport thread={{}} tweets={tweets} />)

    const jsonPreview = getByTestId('thread-export-json-preview').textContent
    const expectedPreview = join('\n', [
      '[',
      '  {',
      '    "id": "1",',
      '    "text": "tweet 1"',
      '  }',
      ']'
    ])

    expect(jsonPreview).toEqual(expectedPreview)
  })

  describe('when download button is clicked', () => {
    it('should download json file and disable button', async () => {
      const tweets = [{ id: '1', text: 'tweet 1' }]
      const thread = { name: 'thread name' }
      const fileName = 'thread-export.json'

      jest.spyOn(fileUtils, 'downloadFile').mockImplementation(() => {})
      jest
        .spyOn(threadExport, 'getThreadExportFileName')
        .mockReturnValue(fileName)

      const { getByTestId } = render(
        <ThreadExport thread={thread} tweets={tweets} />
      )

      const downloadButton = getByTestId('thread-export-download-button')
      downloadButton.click()

      await waitFor(() => expect(downloadButton).toBeDisabled())

      expect(fileUtils.downloadFile).toHaveBeenCalledTimes(1)
      expect(fileUtils.downloadFile).toHaveBeenCalledWith(
        '[\n  {\n    "id": "1",\n    "text": "tweet 1"\n  }\n]',
        fileName
      )

      expect(threadExport.getThreadExportFileName).toHaveBeenCalledTimes(1)
      expect(threadExport.getThreadExportFileName).toHaveBeenCalledWith(thread)
    })
  })

  describe('when copy button is clicked', () => {
    const writeText = jest.fn()

    beforeEach(() => {
      navigator.clipboard = { writeText }
    })

    afterEach(() => {
      writeText.mockReset()
      navigator.clipboard = undefined
    })

    it('should copy export json to clipboard and show message', async () => {
      const tweets = [{ id: '1', text: 'tweet 1' }]
      const thread = { name: 'thread name' }

      jest.spyOn(fileUtils, 'downloadFile').mockImplementation(() => {})

      const { getByTestId, queryByTestId } = render(
        <ThreadExport thread={thread} tweets={tweets} />
      )

      const copyButton = getByTestId('thread-export-copy-button')
      copyButton.click()

      await waitFor(() => {
        const copyMessage = getByTestId('thread-export-copy-message')
        expect(copyMessage.textContent).toEqual('Copied to clipboard!')
      })

      expect(fileUtils.downloadFile).toHaveBeenCalledTimes(0)
      expect(writeText).toHaveBeenCalledTimes(1)
      expect(writeText).toHaveBeenCalledWith(
        '[\n  {\n    "id": "1",\n    "text": "tweet 1"\n  }\n]'
      )

      await waitFor(
        () => {
          const copyMessage = queryByTestId('thread-export-copy-message')
          expect(copyMessage).not.toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })
  })
})
