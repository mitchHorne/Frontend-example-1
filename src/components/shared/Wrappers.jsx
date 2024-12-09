import styled from 'styled-components'

export const FlexRowWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`

export const MainWrapper = styled(FlexRowWrapper)`
  justify-content: space-between;
  min-height: 100%;
  width: 100%;
`
