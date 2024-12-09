import { useState } from 'react'
import { ArcherContainer, ArcherElement } from 'react-archer'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { map, prop } from 'ramda'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { Heading2, StyledInput, TvButton } from '../'
import { getNodeRelations } from './helpers'
import { Thread, Tweet } from '../../types'
import { tweetCanLinkBack } from '../../utils/misc'

library.add(fas)

const GridWrapper = styled.div`
  display: grid;

  grid-template-columns: ${({ columns }) => `repeat(${columns}, 50px)`};
  grid-template-rows: ${({ rows }) => `repeat(${rows}, 50px)`};
`

const GridItem = styled.div`
  grid-column: ${({ gridX }) => `${gridX + 1}`} / span 1;
  grid-row: ${({ gridY }) => `${gridY + 1}`} / span 1;

  display: flex;
`

const Node = styled.span`
  --color: ${({ isParent, isSelected }) =>
    isSelected
      ? 'rgb(24, 128, 198)'
      : isParent
      ? 'gray'
      : 'rgb(239, 243, 244)'};

  --search-color: lightgreen;
  --danger-color: red;
  --link-back-color: orange;

  padding: 0.35rem;
  max-height: 0.35rem;
  border-radius: 50%;
  border: 1px solid black;
  background-color: var(--color);
  cursor: pointer;
  z-index: 50;

  :hover {
    filter: brightness(75%);
    transition: 0.2s;
  }

  animation: ${({
    tweetIsInSearchResult,
    tweetWillBeDeleted,
    tweetCanLinkBack
  }) =>
    tweetWillBeDeleted
      ? 'blinkingDeleteBackground 2s infinite'
      : tweetCanLinkBack
      ? 'blinkingLinkBackBackground 2s infinite'
      : tweetIsInSearchResult
      ? 'blinkingBackground 2s infinite'
      : 'none'};

  @keyframes blinkingBackground {
    0%,
    100% {
      background-color: var(--color);
    }
    50% {
      background-color: var(--search-color);
    }
  }

  @keyframes blinkingDeleteBackground {
    0%,
    100% {
      background-color: var(--color);
    }
    50% {
      background-color: var(--danger-color);
    }
  }
  @keyframes blinkingLinkBackBackground {
    0%,
    100% {
      background-color: var(--color);
    }
    50% {
      background-color: var(--link-back-color);
    }
  }
`

const Wrapper = styled.div`
  background-color: rgb(239, 243, 244);
  display: flex;
  flex-basis: 1;
  flex-flow: column nowrap;
  gap: 2rem;
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;
  scrollbar-width: none;
  width: 100%;
`

const TreeViewHeader = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;

  @media screen and (max-width: 1150px) {
    align-items: flex-start;
  }

  @media screen and (max-width: 850px) {
    flex-flow: column nowrap;
    gap: 1rem;
  }
`

const TreeViewSearchAndActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  gap: 1rem;

  @media screen and (max-width: 1150px) {
    align-items: flex-start;
    flex-flow: column nowrap;
    gap: 1rem;
  }
`

const TreeViewActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;
  width: 100%;
`

const TreeWrapper = styled.div`
  padding-left: 1rem;
`

export const TreeViewComponent = ({
  goToSelectedBranch,
  isInDeletePath,
  searchTweetText,
  selectedTweet,
  showDelete,
  tweets,
  onNodeHover,
  togglePreview,
  showPreview,
  toggleSharing,
  thread,
  onShowExport,
  isUserAdmin,
  showLinkBack
}) => {
  const [searchString, setSearchString] = useState('')
  const isTextInTweet = searchTweetText(searchString)
  const isFinalized = !!thread.finalizedAt

  const columns = Math.max(...map(prop('col'), tweets)) + 1
  const rows = Math.max(...map(prop('row'), tweets)) + 1

  return (
    <Wrapper>
      <TreeViewHeader>
        <Heading2>Tree View</Heading2>
        <TreeViewSearchAndActions>
          <StyledInput
            data-testid='tree-view-search-input'
            onChange={({ target: { value } }) => setSearchString(value)}
            placeholder='Search'
            type='text'
          />
          <TreeViewActions>
            <TvButton onClick={toggleSharing}>
              <FontAwesomeIcon
                icon={['fa-solid', 'fa-arrow-up-from-bracket']}
              />
            </TvButton>
            <TvButton onClick={togglePreview}>
              {showPreview ? 'Edit' : 'Preview'}
            </TvButton>
            {isUserAdmin && (
              <TvButton
                id='title-bar-button'
                disabled={!isFinalized}
                onClick={onShowExport}
              >
                Export
              </TvButton>
            )}
          </TreeViewActions>
        </TreeViewSearchAndActions>
      </TreeViewHeader>

      <TreeWrapper>
        <ArcherContainer
          strokeColor={'lightgray'}
          strokeWidth={1}
          noCurves={true}
          lineStyle={'solid'}
          endShape={null}
          startMarker={false}
          endMarker={false}
        >
          <GridWrapper
            id='three-view-grid-container'
            columns={columns}
            rows={rows}
          >
            {map(tweet => {
              const { col, id, replyToId, row, text } = tweet

              return (
                <GridItem gridX={col} gridY={row} key={`tree-node-item-${id}`}>
                  <ArcherElement id={id} relations={getNodeRelations(tweet)}>
                    <Node
                      id={`thread-tree-node-${row}-${col}`}
                      data-tooltip-id={`thread-tree-node-${id}`}
                      data-testid={`thread-tree-node-${row}-${col}`}
                      onClick={() => goToSelectedBranch(tweet)}
                      isParent={replyToId ? null : 'true'}
                      isSelected={selectedTweet.id === id ? 'true' : null}
                      tweetIsInSearchResult={!showDelete && isTextInTweet(text)}
                      tweetWillBeDeleted={showDelete && isInDeletePath(tweet)}
                      tweetCanLinkBack={
                        showLinkBack && tweetCanLinkBack(selectedTweet, tweet)
                      }
                      onMouseEnter={e => {
                        e.preventDefault()
                        onNodeHover(tweet)
                      }}
                      onMouseLeave={() => onNodeHover(null)}
                    />
                  </ArcherElement>
                </GridItem>
              )
            }, tweets)}
          </GridWrapper>
        </ArcherContainer>
      </TreeWrapper>
    </Wrapper>
  )
}

TreeViewComponent.propTypes = {
  goToSelectedBranch: PropTypes.func.isRequired,
  isInDeletePath: PropTypes.func.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  searchTweetText: PropTypes.func.isRequired,
  selectedTweet: Tweet.isRequired,
  showDelete: PropTypes.bool.isRequired,
  tweets: PropTypes.arrayOf(Tweet).isRequired,
  onNodeHover: PropTypes.func.isRequired,
  togglePreview: PropTypes.func.isRequired,
  showPreview: PropTypes.bool.isRequired,
  showLinkBack: PropTypes.bool.isRequired,
  toggleSharing: PropTypes.func.isRequired,
  thread: Thread.isRequired,
  onShowExport: PropTypes.func.isRequired
}
