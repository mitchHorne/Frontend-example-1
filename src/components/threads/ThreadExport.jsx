import styled from 'styled-components'
import { Thread, Tweet } from '../../types'
import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import { IconButton, TextSpan, TvButton } from '../shared'
import { debounce } from 'lodash'
import { downloadFile } from '../../utils/file'
import {
  getThreadExportFileName,
  getThreadExportJson
} from '../../utils/threadExport'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
`

const ExportJsonPreview = styled.pre`
  background-color: rgb(239, 243, 244);
  border-radius: 0.5rem;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1rem;
`

const CopyButtonWrapper = styled.div`
  height: 0;
  position: relative;
  user-select: none;
`

const CopyButton = styled(IconButton)`
  font-size: 1.5rem;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
`

const CopyMessage = styled(TextSpan)`
  color: #1da1f2;
  font-weight: bold;
  position: absolute;
  right: 4rem;
  top: 1.5rem;
`

export const ThreadExport = ({ thread, tweets }) => {
  const [tweetsExport] = useState(getThreadExportJson(tweets))
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [fileDownloaded, setFileDownloaded] = useState(false)

  const resetShowCopiedMessage = useMemo(
    () => debounce(() => setShowCopiedMessage(false), 2000),
    []
  )

  return (
    <Wrapper>
      <TvButton
        data-testid={'thread-export-download-button'}
        fill
        disabled={fileDownloaded}
        onClick={() => {
          setFileDownloaded(true)
          downloadFile(tweetsExport, getThreadExportFileName(thread))
        }}
      >
        {fileDownloaded ? 'Config Downloaded!' : 'Download Config'}
      </TvButton>

      <CopyButtonWrapper>
        <CopyButton
          data-testid={'thread-export-copy-button'}
          iconCode={'copy'}
          onClick={() => {
            navigator.clipboard.writeText(tweetsExport)
            setShowCopiedMessage(true)
            resetShowCopiedMessage()
          }}
        />
        {showCopiedMessage && (
          <CopyMessage data-testid={'thread-export-copy-message'}>
            Copied to clipboard!
          </CopyMessage>
        )}
      </CopyButtonWrapper>
      <ExportJsonPreview data-testid={'thread-export-json-preview'}>
        {tweetsExport}
      </ExportJsonPreview>
    </Wrapper>
  )
}

ThreadExport.propTypes = {
  thread: Thread.isRequired,
  tweets: PropTypes.arrayOf(Tweet).isRequired
}
