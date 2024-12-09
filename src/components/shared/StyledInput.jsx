import { useState } from 'react'
import { IconButton } from './IconButton'
import styled from 'styled-components'
import PropTypes from 'prop-types'

export const StyledInput = styled.input`
  border-radius: 2rem;
  border: 1px solid #1da1f2;
  color: hsl(210, 13.043478260869565%, 9.019607843137255%);
  font-size: 15px;
  margin: 0;
  padding: 0.5rem 1rem;
`

export const FormControl = styled.div`
  align-items: flex-start;
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  justify-content: flex-start;
  width: 100%;
`

export const FormInput = styled.input`
  border-radius: 0.2rem;
  border: 1px solid #1da1f2;
  color: hsl(210, 13.043478260869565%, 9.019607843137255%);
  font-size: 15px;
  margin: 0;
  padding: 0.5rem;
  width: 100%;
`

const PasswordWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  width: 100%;

  input[type='password'] {
    letter-spacing: ${({ value }) => (value.length ? '0.2em' : '0')};
  }
`

const ViewHideButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  position: absolute;
  right: 2rem;
`

export const PasswordInputControl = ({ autoComplete, ...props }) => {
  const [isVisible, setIsVisible] = useState(false)

  const { value } = props

  return (
    <PasswordWrapper value={value}>
      <FormInput
        {...props}
        type={isVisible ? 'text' : 'password'}
        autoComplete={autoComplete}
      />
      <ViewHideButtonWrapper>
        <IconButton
          iconCode={isVisible ? 'eye-slash' : 'eye'}
          noSpace
          onClick={() => setIsVisible(prevValue => !prevValue)}
        />
      </ViewHideButtonWrapper>
    </PasswordWrapper>
  )
}

PasswordInputControl.propTypes = {
  autoComplete: PropTypes.string,
  value: PropTypes.string
}

PasswordInputControl.defaultProps = {
  autoComplete: 'new-password'
}
