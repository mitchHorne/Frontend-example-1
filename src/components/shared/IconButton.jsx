import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(fas, far)

const IconButtonWrapper = styled.div`
  color: rgb(83, 100, 113);
  display: inline-block;
  font-size: ${({ large, size }) => (large ? '2rem' : size ?? '1rem')};
`

const IconWrapper = styled.div`
  align-items: center;
  cursor: ${({ clickAble, isDisabled }) =>
    clickAble ? (isDisabled ? 'not-allowed' : 'pointer') : 'default'};
  display: flex;
  height: 100%;
  z-index: 100;

  svg {
    border-radius: 50%;
    box-sizing: content-box !important;
    fill: rgb(101, 119, 134);
    height: 1em;
    margin: auto;
    padding: ${props => (props.noSpace ? '0' : '0.75em')};
    transition: 0.2s;
    vertical-align: baseline !important;
  }

  :hover {
    svg,
    span {
      color: ${({ hoverColor, isDisabled }) =>
        isDisabled ? 'rgb(83, 100, 113)' : hoverColor ?? '#1da1f2'};
    }
  }
`

export const IconButton = ({
  iconCode,
  iconType,
  size,
  large,
  noSpace,
  onClick,
  hoverColor = null,
  isDisabled,
  buttonText,
  ...props
}) => (
  <IconButtonWrapper large={large} size={size}>
    <IconWrapper
      clickAble={!!onClick}
      hoverColor={hoverColor}
      noSpace={noSpace}
      onClick={isDisabled ? () => {} : onClick}
      isDisabled={isDisabled}
      {...props}
    >
      {iconCode && <FontAwesomeIcon icon={[iconType ?? 'fas', iconCode]} />}
      {!iconCode && buttonText && (
        <span style={{ fontWeight: 900, padding: '0.75rem' }}>
          {buttonText}
        </span>
      )}
    </IconWrapper>
  </IconButtonWrapper>
)

IconButton.propTypes = {
  hoverColor: PropTypes.string,
  iconCode: PropTypes.string,
  iconType: PropTypes.string,
  large: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  size: PropTypes.string,
  noSpace: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  buttonText: PropTypes.string
}
