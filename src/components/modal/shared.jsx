import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import { Separator } from '../shared'

export const ModalBackgroundCover = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => (props.show ? 'flex' : 'none')};
  height: 100%;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
`

export const CloseButton = styled(FontAwesomeIcon)`
  background-color: transparent;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  position: absolute;
  right: 1rem;
  top: 1rem;
  transition: all 0.3s;

  :hover {
    color: black;
  }
`

export const ModalContentContainer = styled.div`
  background-color: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  position: relative;
`

export const ModalHeading = styled.h3`
  margin: 0;
`

export const ModalSeparator = styled(Separator)`
  margin: 1rem 0;
`
