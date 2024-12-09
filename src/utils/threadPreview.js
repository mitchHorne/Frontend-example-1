import { joinPaths } from './misc'
import { authorized, unauthorized } from './request'

export const prepareThreadPreview = previewResponse => {
  if (!previewResponse?.code) return null

  return {
    ...previewResponse,
    previewUrl: joinPaths(
      process.env.REACT_APP_BASE_URL,
      'preview',
      previewResponse.code
    )
  }
}

export const getSharedThreadPreview = async (token, threadId) => {
  try {
    const result = await authorized(`/threads/${threadId}/share-preview`, token)

    return prepareThreadPreview(result?.data)
  } catch (e) {
    console.error('Fetching shared thread preview failed', { error: e })

    return null
  }
}

export const upsertSharedThreadPreview = async (token, threadId, password) => {
  try {
    const result = await authorized(
      `/threads/${threadId}/share-preview`,
      token,
      { method: 'POST', body: { data: password } }
    )

    return prepareThreadPreview(result?.data)
  } catch (e) {
    console.error('Creating shared thread preview failed', { error: e })

    return null
  }
}

export const viewSharedThreadPreview = async (previewId, password) => {
  try {
    const result = await unauthorized(`/preview/${previewId}`, {
      method: 'POST',
      body: { data: password }
    })

    return result?.data
  } catch (e) {
    console.error('Viewing shared thread preview failed', { error: e })

    return null
  }
}
