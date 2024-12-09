import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const DefaultWrapper = styled.div`
  border-radius: 50%;
  cursor: pointer;
  height: 48px;
  width: 48px;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DefaultProfilePicture = styled(FontAwesomeIcon)`
  height: 30px;
  width: 30px;
  color: white;
`

const TweetProfilePicture = styled.img`
  border-radius: 50%;
  cursor: pointer;
  height: 48px;
  width: 48px;
`

export const ProfilePicture = ({ url, ...props }) =>
  url ? (
    <TweetProfilePicture {...props} referrerPolicy='no-referrer' src={url} />
  ) : (
    <DefaultWrapper>
      <DefaultProfilePicture icon={['fa-solid', 'fa-user']} />
    </DefaultWrapper>
  )

ProfilePicture.propTypes = {
  url: PropTypes.string.isRequired
}
