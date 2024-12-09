import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { TvButton } from '../'
import { useAuth0 } from '@auth0/auth0-react'
import { PulseLoader } from 'react-spinners'
import brLogo from '../../assets/images/logo-small.png'

const Container = styled.div`
  background: linear-gradient(to right, #071f2f, #0c3357 40%, #0083eb);
  color: white;
  display: grid;
  grid-template-columns: 2fr 3fr;
  min-height: 100vh;
  width: 100%;

  @media screen and (max-width: 549px) {
    background: linear-gradient(to bottom, #071f2f, #0c3357 20%, #0083eb);
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 4fr;
  }
`

const LeftColumnDiv = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100%;
  position: relative;
  width: 100%;
`

const RightColumnDiv = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  min-height: 100%;
  width: 100%;

  @media screen and (max-width: 549px) {
    justify-content: flex-start;
  }
`

const Heading = styled.h2`
  font-size: 30px;
  margin: 0;
  padding: 0;
`

const SubHeading = styled.h3`
  font-size: 20px;
`

const Explanation = styled.p`
  font-weight: 400;
  max-width: 500px;
  padding: 0 4rem;
  text-align: center;
`

const PolicyLink = styled(Link)`
  color: white;
`

const BrLogoImage = styled.img`
  background: transparent;
  color: white;
  width: 20vw;
  z-index: 5;
`

export const LoginComponent = ({ authTriggered, handleLogin, authFailed }) => {
  const { logout } = useAuth0()

  const handleLogout = () =>
    logout({
      logoutParams: {
        returnTo: `${process.env.REACT_APP_BASE_URL}/logout/callback`
      }
    })

  return (
    <Container data-testid='login-component'>
      <LeftColumnDiv>
        <BrLogoImage src={brLogo} />
      </LeftColumnDiv>

      <RightColumnDiv>
        <Heading>Thread Maker</Heading>
        <SubHeading>
          Powered by{' '}
          <PolicyLink to='https://www.bluerobot.com/' target='_blank'>
            Blue Robot
          </PolicyLink>
        </SubHeading>
        {authTriggered && !authFailed && (
          <PulseLoader
            data-testid='spinner'
            size={7.5}
            color='white'
            speedMultiplier={0.4}
          />
        )}
        {authFailed && (
          <>
            <Explanation>
              Thread maker is only available to authorized users.
            </Explanation>

            <TvButton
              data-testid='unauthorized-logout-button'
              onClick={handleLogout}
              fill='true'
              fillBackground='#1d9bf0'
              fillHoverBackground='#1a8cd8'
              style={{ marginTop: '3rem', marginBottom: '1rem' }}
            >
              Log out
            </TvButton>
          </>
        )}
        {!authTriggered && !authFailed && (
          <TvButton
            data-testid='login-button'
            onClick={handleLogin}
            fill='true'
            fillBackground='#1d9bf0'
            fillHoverBackground='#1a8cd8'
            style={{ marginTop: '3rem', marginBottom: '1rem' }}
          >
            Sign up / Log in
          </TvButton>
        )}
        <Explanation>
          By signing up, you agree to the{' '}
          <PolicyLink to='https://twitter.com/en/tos' target='_blank'>
            Terms of Service
          </PolicyLink>{' '}
          and{' '}
          <PolicyLink to='https://twitter.com/en/privacy' target='_blank'>
            Privacy Policy
          </PolicyLink>
          , including{' '}
          <PolicyLink
            to='https://help.twitter.com/en/rules-and-policies/twitter-cookies'
            target='_blank'
          >
            Cookie Use
          </PolicyLink>
          .
        </Explanation>
      </RightColumnDiv>
    </Container>
  )
}

LoginComponent.propTypes = {
  authTriggered: PropTypes.bool,
  authFailed: PropTypes.bool,
  handleLogin: PropTypes.func
}
