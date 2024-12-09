import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  FlexRowWrapper,
  FormControl,
  IconButton,
  PasswordInputControl,
  StyledInput,
  TextSpan,
  TvButton,
  ValidationError
} from '../shared'
import { useFormik } from 'formik'
import { format } from 'date-fns'
import { ModalSeparator } from '../modal/shared'
import { useState, useMemo } from 'react'
import { debounce } from 'lodash'

const ShareForm = styled.form`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;
  justify-content: flex-end;
  width: 100%;
`

export const ShareThreadModal = ({ onCloseModal, onConfirm, preview }) => {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)

  const resetShowCopiedMessage = useMemo(
    () =>
      debounce(value => {
        if (value) setShowCopiedMessage(false)
      }, 2000),
    []
  )

  const { expiresAt, previewUrl, isExpired } = preview ?? {}

  const shareForm = useFormik({
    initialValues: { password: '' },
    onSubmit: async values => await onSubmit(values),
    validate: values => {
      const errors = {}
      const getRequiredError = name => `${name} is required`

      const password = values.password

      if (!password) errors.general = getRequiredError('"Password"')
      else if (password.length < 8 || password.length > 64)
        errors.password = 'Password length has to be from 8 to 64 characters'

      return errors
    }
  })

  const {
    dirty,
    handleSubmit,
    handleBlur,
    handleChange,
    isSubmitting,
    resetForm,
    submitCount,
    values: formValues
  } = shareForm

  const onSubmit = values => onConfirm(values).then(() => resetForm())

  const actionText = previewUrl ? 'Update' : 'Create'

  return (
    <ShareForm onSubmit={handleSubmit}>
      {previewUrl && (
        <>
          <FlexRowWrapper style={{ gap: '0.5rem', width: '100%' }}>
            <IconButton
              iconCode={'copy'}
              noSpace
              onClick={() => {
                navigator.clipboard.writeText(previewUrl)
                setShowCopiedMessage(true)
                resetShowCopiedMessage(true)
              }}
            />
            <StyledInput
              disabled={true}
              value={showCopiedMessage ? 'Link copied!' : `Link: ${previewUrl}`}
              style={{
                width: '100%',
                backgroundColor: '#1da1f2',
                color: 'white',
                fontWeight: '700'
              }}
              autoComplete='none'
            />
          </FlexRowWrapper>
          {expiresAt && (
            <TextSpan style={{ color: isExpired ? 'red' : 'unset' }}>
              <strong>{isExpired ? 'Expired at' : 'Valid until'}: </strong>
              {format(expiresAt, 'd MMMM yyyy · p')}
            </TextSpan>
          )}

          {isExpired && (
            <TextSpan style={{ color: 'red' }}>
              Please update the password below to re-activate this preview.
            </TextSpan>
          )}
          <ModalSeparator />
        </>
      )}
      <FormControl>
        <TextSpan>
          <strong>{actionText} password for your sharing link</strong>
        </TextSpan>
        <PasswordInputControl
          id='password'
          name='password'
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder='Thread sharing password'
          value={formValues.password}
          disabled={isSubmitting}
        />

        {!isSubmitting && submitCount > 0 && (
          <ValidationError name='password' formik={shareForm} />
        )}
      </FormControl>

      <ButtonWrapper>
        <TvButton fill='true' type='submit' disabled={!dirty || isSubmitting}>
          {actionText} password
        </TvButton>
        <TvButton onClick={onCloseModal} type='button' disabled={isSubmitting}>
          Close
        </TvButton>
      </ButtonWrapper>
    </ShareForm>
  )
}

ShareThreadModal.propTypes = {
  onCloseModal: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  preview: PropTypes.object
}

ShareThreadModal.defaultProps = {
  preview: {}
}
