import { HashLoader } from 'react-spinners'
import styled from 'styled-components'

const Wrapper = styled.div`
  align-items: center;
  background-color: #00000099;
  display: flex;
  height: 100%;
  justify-content: center;
  position: fixed;
  width: 100%;
  z-index: 9999;
`

export const SpinnerElement = () => (
  <HashLoader data-testid='spinner' size={100} color='#1da1f2' />
)

export const Spinner = () => (
  <Wrapper>
    <SpinnerElement />
  </Wrapper>
)
