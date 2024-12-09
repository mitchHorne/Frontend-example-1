import styled from 'styled-components'
import PropTypes from 'prop-types'

export const TvButton = styled.button`
  padding: ${({ large }) => (large ? '1rem' : '0.5rem')} 1rem;
  border: ${({ fill }) => (fill ? 0 : '2px')} solid #ccc;
  border-radius: 2rem;
  font-size: 1rem;
  background: ${({ fill, fillBackground, disabled }) =>
    fill ? (disabled ? '#ccc' : fillBackground) : 'white'};
  color: ${({ fill, disabled }) =>
    fill ? 'white' : disabled ? '#ccc' : '#1da1f2'};
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  transition: all 0.3s;
  user-select: none;

  :hover {
    border-color: ${({ disabled }) => (disabled ? '#ccc' : '#1da1f2')};

    ${({ fill, fillHoverBackground, disabled }) =>
      fill && fillHoverBackground && !disabled
        ? `background: ${fillHoverBackground}`
        : ''};
  }
`

TvButton.propTypes = {
  large: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  fill: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  fillBackground: PropTypes.string,
  fillHoverBackground: PropTypes.string
}

TvButton.defaultProps = {
  fillBackground: '#1da1f2',
  fillHoverBackground: '#1a8cd8'
}
