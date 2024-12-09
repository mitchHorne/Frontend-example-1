import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  CloseButton,
  ModalBackgroundCover,
  ModalContentContainer,
  ModalHeading,
  ModalSeparator
} from './shared'
import { TextSpan, TvButton } from '../'
import { useOnKeyPress } from '../../hooks'

const BackgroundCover = styled(ModalBackgroundCover)`
  flex-flow: column nowrap;
  position: absolute;
`

const ModalContainer = styled(ModalContentContainer)`
  top: 100px;
  width: 80%;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 2rem;
  gap: 1rem;
`

export const DeleteModal = ({ close, confirm, heading, show }) => {
  useOnKeyPress({ action: close })

  return (
    <BackgroundCover show={show}>
      <ModalContainer>
        <ModalHeading>{heading}</ModalHeading>
        <CloseButton icon={['fas', 'fa-x']} onClick={close} />
        <ModalSeparator />
        <TextSpan>
          Are you sure you want to delete this Post and its dependents
        </TextSpan>
        <ButtonContainer>
          <TvButton onClick={close}>Cancel</TvButton>
          <TvButton onClick={confirm} fill='true' fillBackground='red'>
            Confirm
          </TvButton>
        </ButtonContainer>
      </ModalContainer>
    </BackgroundCover>
  )
}

DeleteModal.propTypes = {
  close: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired
}
