import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Select from 'react-select'
import {
  always,
  ascend,
  descend,
  filter,
  ifElse,
  map,
  not,
  path,
  pathEq,
  pipe,
  prop,
  reduce,
  sort,
  valuesIn
} from 'ramda'
import { Heading2, TextSpan, TitleBar, FlexRowWrapper, IconButton } from '../'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { THREAD_FINALIZED_TOOLTIP } from '../../constants'
import { Tooltip } from 'react-tooltip'
import { useState } from 'react'

const ThreadOption = styled(Link)`
  border-radius: 0.2rem;
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  height: auto;
  justify-content: space-between;
  max-width: 100%;
  padding: 1rem;
  text-decoration: none;
  user-select: none;
  width: 100%;

  :hover {
    background-color: rgba(15, 20, 25, 0.1);
  }
`

const Content = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
`

const OptionContent = styled(Content)`
  max-width: 80%;
`

const Picture = styled.img`
  border-radius: 1rem;
  height: 60px;
  width: 60px;
`

const ThreadLockedTooltip = styled(Tooltip)`
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  max-width: 300px;
  position: absolute;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
`

const FilterAndSort = styled.div`
  padding: 1rem 1rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
  width: 100%;
  gap: 0.5rem;
`

const Filters = styled.div`
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
`

const Sorting = styled.div`
  width: 50%;
  display: flex;
  flex-flow: row nowrap;
  gap: 0.5rem;
  align-items: center;
`

const StyledSelect = styled(Select)`
  height: auto;
  width: 100%;
  border-radius: 2rem;
`

const ThreadName = styled(Heading2)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`

const ThreadDescription = styled(TextSpan)`
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`

const sortingOptions = [
  { value: ['updatedAt'], label: 'Date Updated' },
  { value: ['description'], label: 'Thread Description' },
  { value: ['name'], label: 'Thread Name' },
  { value: ['twitterProfile', 'username'], label: 'User' }
]

const reactSelectStyles = {
  control: provided => ({
    ...provided,
    borderRadius: '0.5rem'
  }),
  menu: provided => ({
    ...provided,
    borderRadius: '0.5rem'
  }),
  menuList: provided => ({
    ...provided,
    padding: '0'
  }),
  option: provided => ({
    ...provided,
    borderRadius: '0.5rem'
  }),
  clearIndicator: provided => ({
    ...provided,
    cursor: 'pointer'
  }),
  dropdownIndicator: provided => ({
    ...provided,
    cursor: 'pointer'
  })
}

export const ThreadMenuComponent = ({
  threads,
  heading,
  subHeading,
  onAddThread,
  onContextMenu,
  relativeRoute,
  setHoverThread
}) => {
  const [filterUserId, setFilterUserId] = useState(null)
  const [isAscending, setIsAscending] = useState(false)
  const [sortBy, setSortBy] = useState(['updatedAt'])

  const filterOptions = pipe(
    reduce((result, { twitterProfile }) => {
      if (!twitterProfile?.id || !twitterProfile.username) return result

      const { id, username } = twitterProfile

      return {
        ...result,
        [id]: {
          label: `@${username}`,
          value: id
        }
      }
    }, {}),
    valuesIn,
    sort(ascend(prop('label')))
  )(threads)

  const sortedThreads = sort(
    ifElse(always(isAscending), ascend, descend)(path(sortBy)),
    threads
  )

  const filteredThreads = filterUserId
    ? filter(pathEq(filterUserId, ['twitterProfile', 'id']))(sortedThreads)
    : sortedThreads

  return (
    <>
      <Content>
        <TitleBar
          heading={heading}
          subHeading={subHeading}
          buttonText='Create'
          buttonAction={onAddThread}
          padding='1rem'
        />
        <FilterAndSort>
          <Filters>
            <StyledSelect
              isClearable={true}
              isLoading={!filterOptions}
              isRtl={false}
              isSearchable={true}
              onChange={pipe(prop('value'), setFilterUserId)}
              options={filterOptions}
              placeholder='Filter by handle'
              styles={reactSelectStyles}
              data-testid='thread-user-handle-filter-select'
            />
          </Filters>
          <Sorting>
            <IconButton
              noSpace
              onClick={() => setIsAscending(not)}
              iconCode={
                isAscending
                  ? 'fa-arrow-up-short-wide'
                  : 'fa-arrow-down-wide-short'
              }
            />
            <StyledSelect
              defaultValue={sortingOptions[0]}
              isClearable={false}
              isLoading={!sortingOptions}
              isRtl={false}
              isSearchable={false}
              onChange={pipe(prop('value'), setSortBy)}
              options={sortingOptions}
              styles={reactSelectStyles}
            />
          </Sorting>
        </FilterAndSort>
      </Content>
      {map(thread => {
        const {
          name,
          id,
          description,
          twitterProfile,
          updatedAt,
          createdAt,
          finalizedAt
        } = thread

        const picture = prop('profileImageUrl', twitterProfile)

        const threadDate = updatedAt ?? createdAt

        return (
          <ThreadOption
            data-testid={`thread-option-${id}`}
            relative
            to={`${relativeRoute}${id}`}
            key={id}
            onContextMenu={e => onContextMenu && onContextMenu(e, thread)}
            onMouseEnter={() => setHoverThread(thread)}
          >
            <OptionContent>
              <FlexRowWrapper style={{ gap: '0.5rem', maxWidth: '100%' }}>
                <ThreadName>{name}</ThreadName>
                {finalizedAt && (
                  <>
                    <FontAwesomeIcon
                      style={{ color: 'black' }}
                      icon={['fa-solid', 'fa-lock']}
                      id={`thread-menu-item-locked-${id}`}
                      data-tooltip-content={THREAD_FINALIZED_TOOLTIP}
                    />
                    <ThreadLockedTooltip
                      id={`thread-menu-item-locked-tooltip-${id}`}
                      anchorSelect={`#thread-menu-item-locked-${id}`}
                      closeOnEsc
                      place='right'
                      positionStrategy='absolute'
                      noArrow={false}
                      variant='dark'
                    />
                  </>
                )}
              </FlexRowWrapper>
              <ThreadDescription>{description}</ThreadDescription>
              {threadDate && (
                <TextSpan style={{ paddingTop: '0.5rem' }}>
                  {format(threadDate, 'd MMMM')}
                </TextSpan>
              )}
            </OptionContent>
            {picture && (
              <Picture data-testid={`thread-picture-${name}`} src={picture} />
            )}
          </ThreadOption>
        )
      }, filteredThreads)}
    </>
  )
}

ThreadMenuComponent.propTypes = {
  threads: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      name: PropTypes.string.isRequired,
      picture: PropTypes.string,
      tweets: PropTypes.array
    })
  ),
  heading: PropTypes.string.isRequired,
  subHeading: PropTypes.string,
  onAddThread: PropTypes.func,
  onContextMenu: PropTypes.func,
  relativeRoute: PropTypes.string,
  setHoverThread: PropTypes.func
}

ThreadMenuComponent.defaultProps = {
  relativeRoute: ''
}
