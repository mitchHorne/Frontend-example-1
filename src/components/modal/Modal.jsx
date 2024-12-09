import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextSpan } from '../shared'
import {
  CloseButton,
  ModalBackgroundCover,
  ModalContentContainer,
  ModalHeading,
  ModalSeparator
} from './shared'
import { useOnKeyPress } from '../../hooks'

const BackgroundCover = styled(ModalBackgroundCover)`
  justify-content: center;
  position: fixed;
`

const ModalContainer = styled(ModalContentContainer)`
  width: ${({ size }) => size ?? 80}%;
`

export const Modal = ({
  Body,
  close,
  heading,
  show,
  size,
  subHeading,
  ...props
}) => {
  useOnKeyPress({ action: close })

  return (
    <BackgroundCover show={show}>
      <ModalContainer size={size}>
        <ModalHeading>{heading}</ModalHeading>
        <TextSpan style={{ marginTop: '0.5rem' }}>{subHeading}</TextSpan>
        <CloseButton icon={['fas', 'fa-x']} onClick={close} />
        <ModalSeparator />
        <Body {...props} />
      </ModalContainer>
    </BackgroundCover>
  )
}

Modal.propTypes = {
  Body: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  size: PropTypes.number,
  subHeading: PropTypes.string
}
