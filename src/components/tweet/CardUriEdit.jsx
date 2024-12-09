import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  ErrorSpan,
  FormControl,
  FormInput,
  TextSpan,
  TvButton
} from '../shared'

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
export const CardUriEdit = ({ onCloseModal, onConfirm, onChange, error }) => (
  <BodyWrapper>
    <FormControl>
      <TextSpan>
        <strong>Card URI</strong>
      </TextSpan>
      <FormInput
        id='cardUri'
        name='cardUri'
        placeholder='Eg. card://123456'
        data-testid='tweet-edit-card-uri-input'
        onChange={({ target: { value } }) => onChange(value)}
      />
      {!!error && (
        <ErrorSpan style={{ paddingLeft: '0.5rem' }}>{error}</ErrorSpan>
      )}
    </FormControl>
    <ButtonWrapper>
      <TvButton onClick={onCloseModal}>Cancel</TvButton>
      <TvButton onClick={onConfirm} fill='true' disabled={!!error}>
        Save
      </TvButton>
    </ButtonWrapper>
  </BodyWrapper>
)

CardUriEdit.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string
}
