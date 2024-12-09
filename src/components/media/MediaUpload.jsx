import { prop, propOr } from 'ramda'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { User } from '../../types'

const allowedImageTypes = ['jpeg', 'jpg', 'png', 'webp']
const allowedVideoTypes = ['mp4', 'mov']
const allowedGifTypes = ['gif']

/**
 * @param {object} props
 * @param {function} props.onMediaUpload Function called with each media url uploaded
 * @param {boolean} props.showModal Flag indicative of the upload modal showing or not
 * @param {function} props.setShowModal Function called with boolean value to set props.showModal
 * @returns An empty component that shows or hides the Cloudinary media upload modal
 */
export const MediaUpload = ({
  onMediaUpload,
  mediaType,
  onModalClose,
  user,
  existingCount
}) => {
  const isGif = mediaType === 'gif'
  const isVideo = mediaType === 'video'
  const isImage = mediaType === 'image'

  const [uploadWidget, setUploadWidget] = useState(null)
  const showModal = !!mediaType
  const allowedMediaTypes = isImage
    ? allowedImageTypes
    : isVideo
    ? allowedVideoTypes
    : isGif
    ? allowedGifTypes
    : []
  const allowMultiple = mediaType === 'image'
  const { images: imageCount, videos: videoCount } = existingCount

  const maxFiles = isImage
    ? 4 - (imageCount + videoCount)
    : isVideo || isGif
    ? 1 - videoCount
    : 0

  const oneMegabyte = 1024 * 1024
  const maxImageSize = 5 * oneMegabyte
  const maxGifSize = 15 * oneMegabyte
  const maxVideoSize = 1000 * oneMegabyte

  const getWidget = () => {
    return window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url'],
        folder: `threadmaker/${process.env.REACT_APP_ENV}/${propOr(
          'unknown',
          'id',
          user
        )}`,
        clientAllowedFormats: allowedMediaTypes,
        singleUploadAutoClose: false,
        showUploadMoreButton: false,
        multiple: allowMultiple,
        maxImageFileSize: isGif ? maxGifSize : maxImageSize,
        maxVideoFileSize: isVideo ? maxVideoSize : maxGifSize,
        maxFiles
      },
      (error, result) => {
        if (error || !result) return

        const { event, info } = result

        if (event === 'close') return onModalClose()
        if (event === 'success') {
          const secureUrl = prop('secure_url', info)
          return onMediaUpload(mediaType, secureUrl)
        }
      }
    )
  }

  useEffect(() => {
    if (showModal && !uploadWidget) {
      const widget = getWidget()
      widget.open()
      setUploadWidget(widget)
    }

    if (!showModal && uploadWidget) {
      uploadWidget.destroy()
      setUploadWidget(null)
    }
  }, [uploadWidget, showModal, mediaType])

  return null
}

MediaUpload.propTypes = {
  onMediaUpload: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired,
  mediaType: PropTypes.oneOf(['image', 'video', 'gif']),
  user: User.isRequired,
  existingCount: PropTypes.shape({
    images: PropTypes.number,
    videos: PropTypes.number
  })
}
