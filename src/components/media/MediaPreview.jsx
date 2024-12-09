import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { complement, endsWith, filter, not, pipe, prop } from 'ramda'

const Wrapper = styled.div`
  --column-percentage: ${({ columns }) => `${100 / columns}%`};
  --columns: ${({ columns }) => columns};
  --rows-percentage: ${({ rows }) => `${100 / rows}%`};
  --rows: ${({ rows }) => rows};

  display: grid;
  grid-gap: 1px;
  grid-template-columns: repeat(var(--columns), var(--column-percentage));
  grid-template-rows: repeat(var(--rows), var(--rows-percentage));
  overflow: hidden;
  padding: 0.5rem;
  user-select: none;
  width: 100%;
`

const MediaWrapper = styled.div`
  align-items: center;
  display: flex;
  grid-row: span ${({ rowSpan }) => rowSpan};
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
`

const Video = styled.video`
  border-radius: 1rem;
  min-width: 100%;
  object-fit: cover;
  position: relative;
`

const Image = styled.img`
  aspect-ratio: 1;
  border-radius: 1rem;
  width: 100%;
  height: auto;
  object-fit: contain;
`

const MediaButton = styled(FontAwesomeIcon)`
  aspect-ratio: 1;
  background-color: black;
  border-radius: 50%;
  border: 2px solid black;
  color: #ccc;
  cursor: pointer;
  font-size: 1rem;
  position: absolute;
  right: 1rem;
  top: 1rem;
  transition: all 0.3s;
  z-index: 2;

  :hover {
    color: white;
  }
`

export const MediaPreview = ({ media, isVideo, onRemove }) => {
  const mediaItems = pipe(
    media => (Array.isArray(media) ? media : [media]),
    filter(complement(not))
  )(media)

  const length = mediaItems?.length ?? 0
  const rows = 1
  const columns = isVideo ? 1 : length

  if (!length) return null

  return (
    <Wrapper className='media-container' rows={rows} columns={columns}>
      {mediaItems.map((mediaItem, index) => {
        const mediaUrl = isVideo ? prop('videoUrl', mediaItem) : mediaItem
        const rowSpan = isVideo ? 1 : index === 0 && length % 2 === 1 ? 2 : 1
        const isGif = endsWith('.gif', mediaUrl)

        return (
          <MediaWrapper key={index} rowSpan={rowSpan}>
            {onRemove && (
              <MediaButton
                icon={['fas', 'fa-x']}
                onClick={() => onRemove(mediaUrl)}
              />
            )}
            {isVideo && !isGif ? (
              <Video controls poster={`${mediaUrl.slice(0, -4)}.jpg`}>
                <source
                  src={mediaUrl}
                  type={`video/${mediaUrl.split('.').pop()}`}
                />
                <Image src={`${mediaUrl.slice(0, -4)}.jpg`} alt='Media' />
              </Video>
            ) : (
              <>
                <Image src={mediaUrl} alt='Media' />
              </>
            )}
          </MediaWrapper>
        )
      })}
    </Wrapper>
  )
}

MediaPreview.propTypes = {
  media: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.shape({ videoUrl: PropTypes.string.isRequired })
    )
  ]),
  isVideo: PropTypes.bool,
  onRemove: PropTypes.func
}
