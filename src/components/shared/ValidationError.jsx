import { prop } from 'ramda'
import styled from 'styled-components'
import PropTypes from 'prop-types'

export const ErrorSpan = styled.span`
  color: red;
  font-size: 12px;
  padding-left: 0.5rem;
`

export const ValidationError = ({ name, formik }) => {
  const isTouched = prop(name, formik.touched)
  const error = prop(name, formik.errors)

  if (!isTouched || !error) return null

  return <ErrorSpan>{error}</ErrorSpan>
}

ValidationError.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.shape({
    touched: PropTypes.object,
    errors: PropTypes.object
  })
}
