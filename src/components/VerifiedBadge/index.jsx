import PropTypes from 'prop-types'
import { BlueBadge } from './BlueBadge'
import { BusinessBadge } from './BusinessBadge'
import { GovernmentBadge } from './GovernmentBadge'

export const VerifiedBadge = ({ verifiedType }) => {
  if (verifiedType === 'blue') return <BlueBadge />
  if (verifiedType === 'business') return <BusinessBadge />
  if (verifiedType === 'government') return <GovernmentBadge />

  return null
}

VerifiedBadge.propTypes = {
  verifiedType: PropTypes.string
}
