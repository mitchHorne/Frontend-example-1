import { prop } from 'ramda'
import { authorized } from './request'

export const getTwitterUserByHandle = async (token, handle) => {
  try {
    const result = await authorized(`twitter-user/${handle}`, token)

    return prop('data', result)
  } catch (e) {
    console.error(`Failed to fetch 𝕏 user "${handle}"`, { error: e })
    return null
  }
}
