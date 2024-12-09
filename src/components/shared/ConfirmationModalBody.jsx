import { TextSpan, TvButton } from '../shared'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BodyWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;
  justify-content: flex-end;
`

export const ConfirmationModalBody = ({
  contentText,
  onCloseModal,
  onConfirm,
  confirmButtonBackground,
  isBusy
}) => (
  <BodyWrapper>
    <TextSpan>{contentText}</TextSpan>
    <ButtonWrapper>
      <TvButton onClick={onCloseModal}>Cancel</TvButton>
      <TvButton
        onClick={onConfirm}
        fill='true'
        fillBackground={confirmButtonBackground}
        disabled={isBusy}
      >
        Confirm
      </TvButton>
    </ButtonWrapper>
  </BodyWrapper>
)

ConfirmationModalBody.propTypes = {
  contentText: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmButtonBackground: PropTypes.string,
  isBusy: PropTypes.bool.isRequired
}

ConfirmationModalBody.defaultProps = {
  confirmButtonBackground: '#1da1f2'
}
