import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextSpan } from '../'
import { VerifiedBadge } from '../VerifiedBadge'

export const Wrapper = styled.div`
  align-items: ${({ flexDirection }) =>
    flexDirection === 'row' ? 'center' : 'flex-start'};
  display: flex;
  flex-flow: ${({ flexDirection }) => flexDirection} wrap;
  gap: ${({ gap }) => gap};
  justify-content: flex-start;
`

export const NameAndBadgeWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 0.2rem;
`

const TweetUserHandleText = styled(TextSpan)`
  color: rgb(83, 100, 113);
  cursor: pointer;
  font-weight: 500;
`
const TweetUserNameText = styled(TextSpan)`
  cursor: pointer;
  font-weight: bold;

  :hover {
    text-decoration: underline;
  }
`

export const TweetUserHandle = ({
  name,
  handle,
  verifiedType,
  flexDirection,
  gap
}) => (
  <Wrapper flexDirection={flexDirection} gap={gap}>
    <NameAndBadgeWrapper>
      <TweetUserNameText>{name}</TweetUserNameText>
      <VerifiedBadge verifiedType={verifiedType} />
    </NameAndBadgeWrapper>
    {handle && <TweetUserHandleText>@{handle}</TweetUserHandleText>}
  </Wrapper>
)

TweetUserHandle.propTypes = {
  name: PropTypes.string.isRequired,
  handle: PropTypes.string.isRequired,
  verifiedType: PropTypes.string,
  flexDirection: PropTypes.string,
  gap: PropTypes.string
}

TweetUserHandle.defaultProps = {
  flexDirection: 'row',
  gap: '0.5rem'
}
