import { useState, useEffect } from 'react'
import {
  getSharedThreadPreview,
  upsertSharedThreadPreview
} from '../utils/threadPreview'
import { useCallFunctionAsync } from './useCallFunctionAsync'

export const useSharedThreadPreview = (token, threadId) => {
  const [preview, setPreview] = useState()

  useEffect(() => {
    const fetchPreview = async () => {
      const previewResult = await getSharedThreadPreview(token, threadId)

      setPreview(previewResult ?? null)
    }

    fetchPreview()
  }, [threadId])

  const [upsertPreview, upsertIsBusy] = useCallFunctionAsync(async password => {
    const result = await upsertSharedThreadPreview(token, threadId, password)
    setPreview(result)
  })

  return [preview, upsertPreview, upsertIsBusy]
}
