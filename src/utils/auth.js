import { includes } from 'ramda'
import { authorized } from './request'

export const login = async accessToken => {
  try {
    const userMetaData = await authorized('signin', accessToken, {
      method: 'POST'
    })

    return userMetaData?.data
  } catch (e) {
    console.error('Authentication failed', { error: e })

    return null
  }
}

export const getIsUserAdmin = user => includes('admin', user?.roles ?? [])
