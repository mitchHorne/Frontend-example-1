import { joinPaths } from './misc'

const { REACT_APP_BACKEND_URL } = process.env

export const unauthorized = async (
  path,
  { method = 'GET', contentType = 'application/json', body = undefined } = {}
) => {
  const response = await fetch(joinPaths(REACT_APP_BACKEND_URL, path), {
    headers: {
      'Content-Type': contentType
    },
    method,
    mode: 'cors',
    body: JSON.stringify(body)
  })

  if (contentType === 'application/json') return await response.json()

  return response
}

export const authorized = async (
  path,
  token,
  { method = 'GET', contentType = 'application/json', body = undefined } = {}
) => {
  const response = await fetch(joinPaths(REACT_APP_BACKEND_URL, path), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': contentType
    },
    method,
    mode: 'cors',
    body: JSON.stringify(body)
  })

  if (contentType === 'application/json') return await response.json()

  return response
}
