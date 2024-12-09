import { Heading2 } from './Heading2'
import { TvButton } from './TvButton'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextSpan } from './TextSpan'
import { FlexRowWrapper } from './Wrappers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton } from './IconButton'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${({ padding }) => padding ?? '0'};
  gap: 0.5rem;
`

const HeadingWrapper = styled.div`
  display: flex;
  max-width: 80%;
  flex-flow: column nowrap;
  gap: 1rem;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 1rem;
`

const Heading = styled(Heading2)`
  overflow-x: hidden;
  text-overflow: ellipsis;
  width: 100%;
`

export const TitleBar = ({
  buttonAction,
  buttonDisabled,
  buttonHidden,
  buttonText,
  heading,
  headingIcon,
  padding,
  subHeading,
  helpAction
}) => (
  <Wrapper padding={padding}>
    <HeadingWrapper>
      <FlexRowWrapper style={{ gap: '0.5rem' }}>
        <Heading>{heading}</Heading>
        {headingIcon && <FontAwesomeIcon icon={['fa-solid', headingIcon]} />}
      </FlexRowWrapper>
      {subHeading && <TextSpan>{subHeading}</TextSpan>}
    </HeadingWrapper>
    <ButtonWrapper>
      {buttonAction && !buttonHidden && (
        <TvButton
          id='title-bar-button'
          data-testid='title-bar-button'
          disabled={buttonDisabled}
          onClick={buttonAction}
        >
          {buttonText}
        </TvButton>
      )}
      {helpAction && (
        <IconButton
          iconCode='fa-circle-info'
          onClick={helpAction}
          noSpace
        ></IconButton>
      )}
    </ButtonWrapper>
  </Wrapper>
)

export const PaddedTitleBar = styled(TitleBar)`
  padding: 1rem;
`

TitleBar.propTypes = {
  buttonAction: PropTypes.func,
  buttonDisabled: PropTypes.bool,
  buttonHidden: PropTypes.bool,
  buttonText: PropTypes.string,
  heading: PropTypes.string.isRequired,
  headingIcon: PropTypes.string,
  helpAction: PropTypes.func,
  padding: PropTypes.string,
  subHeading: PropTypes.string
}
