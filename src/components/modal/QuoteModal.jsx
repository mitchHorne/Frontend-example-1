import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  CloseButton,
  ModalBackgroundCover,
  ModalContentContainer,
  ModalHeading,
  ModalSeparator
} from './shared'
import { useOnKeyPress } from '../../hooks'

const BackgroundCover = styled(ModalBackgroundCover)`
  flex-flow: column nowrap;
  position: absolute;
`

const ModalContainer = styled(ModalContentContainer)`
  top: 100px;
  width: 80%;
`

export const QuoteModal = ({ Body, close, heading, show, ...props }) => {
  useOnKeyPress({ action: close })

  return (
    <BackgroundCover show={show}>
      <ModalContainer>
        <ModalHeading>{heading}</ModalHeading>
        <CloseButton icon={['fas', 'fa-x']} onClick={close} />
        <ModalSeparator />
        <Body {...props} />
      </ModalContainer>
    </BackgroundCover>
  )
}

QuoteModal.propTypes = {
  Body: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired
}
