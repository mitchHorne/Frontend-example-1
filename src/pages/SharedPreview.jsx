import { useParams } from 'react-router'
import styled from 'styled-components'
import { useEffect } from 'react'
import { SharedPreviewContainer } from '../containers/SharedPreview'

const Wrapper = styled.div`
  align-items: flex-start;
  background-color: white;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: center;
  min-height: 100vh;
  min-width: 100%;
  width: 100%;
`

export const SharedPreview = () => {
  const { previewId } = useParams()

  useEffect(() => {}, [])

  return (
    <Wrapper>
      <SharedPreviewContainer previewId={previewId} />
    </Wrapper>
  )
}
