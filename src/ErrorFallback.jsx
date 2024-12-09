import styled from 'styled-components'
import PropTypes from 'prop-types'

const ErrorContainer = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
`

const ErrorText = styled.p`
  margin: 0;
  font-size: 1rem;
`

const ErrorButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
  }
`

function ErrorFallback ({ error }) {
  const handleClick = () => {
    window.location.href = process.env.REACT_APP_BASE_URL
  }

  return (
    <ErrorContainer>
      <ErrorText>Oops! Something went wrong:</ErrorText>
      <pre>{error.message}</pre>
      <ErrorButton onClick={handleClick}>Go back home</ErrorButton>
    </ErrorContainer>
  )
}

ErrorFallback.propTypes = {
  error: PropTypes.object
}

export default ErrorFallback
