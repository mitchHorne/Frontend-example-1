import {
  ErrorSpan,
  FormInput,
  TextSpan,
  TvButton,
  ValidationError
} from '../shared'
import { useFormik } from 'formik'
import { equals, pipe, prop, replace, toLower, trim } from 'ramda'
import { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormControl } from '../shared/StyledInput'

const ModalForm = styled.form`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
`

const UserSearch = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 50% 25%;
  width: 100%;
`

const DescriptionInput = styled.textarea`
  border-radius: 0.2rem;
  border: 1px solid #1da1f2;
  color: hsl(210, 13.043478260869565%, 9.019607843137255%);
  font-family: inherit;
  font-size: 15px;
  height: 5rem;
  margin: 0;
  padding: 0.5rem;
  resize: none;
  width: 100%;
`

export const ThreadDetailsModal = ({
  thread,
  onSave,
  fetchTwitterUserByHandle,
  saveIsBusy,
  searchIsBusy
}) => {
  const { twitterProfile, name, description, id } = thread
  const twitterId = prop('id', twitterProfile)
  const username = prop('username', twitterProfile)

  const [userSearch, setUserSearch] = useState('')
  const [searchError, setSearchError] = useState('')
  const [userResult, setUserResult] = useState({ username, id: twitterId })

  const onUserSearchChange = ({ target }) => {
    const value = pipe(replace(/^@+/, ''), trim, toLower)(target.value)
    setUserSearch(value)
  }

  const threadForm = useFormik({
    initialValues: { name, description, id, twitterId, username },
    onSubmit: async values => await onSave(values),
    validate: values => {
      const errors = {}
      const getRequiredError = name => `${name} is required`

      if (!trim(values?.name)) errors.name = getRequiredError('"Thread name"')

      if (!trim(values.description))
        errors.description = getRequiredError('"Thread description"')

      if (!trim(values?.twitterId ?? ''))
        errors.twitterId = getRequiredError('"𝕏 user"')

      return errors
    }
  })

  const isSaveDisabled = !threadForm.dirty || !threadForm.isValid || saveIsBusy
  const isSearchDisabled =
    !trim(userSearch) || equals(userSearch, userResult.username) || searchIsBusy

  const onUserSearch = async () => {
    setSearchError('')
    const handle = userSearch
    const user = await fetchTwitterUserByHandle(handle)

    if (!user) {
      setSearchError(`User "${handle}" not found`)

      return
    }

    setUserResult(user)

    const { id } = user
    await threadForm.setFieldValue('twitterId', id, true)
  }

  return (
    <ModalForm onSubmit={threadForm.handleSubmit}>
      <FormControl>
        <TextSpan>
          <strong>Thread name</strong>
        </TextSpan>
        <FormInput
          id='name'
          name='name'
          placeholder='A name for the thread'
          maxLength='255'
          data-testid='thread-details-name-input'
          value={threadForm.values.name}
          onChange={threadForm.handleChange}
          onBlur={threadForm.handleBlur}
        />
        <ValidationError name='name' formik={threadForm} />
      </FormControl>
      <FormControl>
        <TextSpan>
          <strong>Thread description</strong>
        </TextSpan>
        <DescriptionInput
          id='description'
          name='description'
          placeholder='A description of the thread'
          maxLength='255'
          data-testid='thread-details-description-input'
          value={threadForm.values.description}
          onChange={threadForm.handleChange}
          onBlur={threadForm.handleBlur}
        />
        <ValidationError name='description' formik={threadForm} />
      </FormControl>
      <FormControl>
        <TextSpan>
          <strong>
            𝕏 user handle (This is for display purpose only - no Posts will be
            sent from this account)
          </strong>
        </TextSpan>

        <TextSpan
          id='thread-details-current-user-text'
          data-testid='thread-details-current-user-text'
        >
          Current user: {`@${userResult.username ?? ''}`}
        </TextSpan>
        <UserSearch>
          <FormInput
            id='thread-details-twitter-user-search-input'
            data-testid='thread-details-twitter-user-search-input'
            placeholder='Search for 𝕏 handle'
            onChange={onUserSearchChange}
          />
          <TvButton
            id='thread-details-twitter-user-search-button'
            data-testid='thread-details-twitter-user-search-button'
            type='button'
            onClick={onUserSearch}
            disabled={isSearchDisabled}
          >
            Search
          </TvButton>
        </UserSearch>
        {searchError && (
          <ErrorSpan data-testid='thread-details-twitter-search-error'>
            {searchError}
          </ErrorSpan>
        )}
      </FormControl>

      <TvButton
        id='thread-details-submit-button'
        data-testid='thread-details-submit-button'
        type='submit'
        disabled={isSaveDisabled}
      >
        Save
      </TvButton>
    </ModalForm>
  )
}

ThreadDetailsModal.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    twitterProfile: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string
    })
  }),
  onSave: PropTypes.func.isRequired,
  fetchTwitterUserByHandle: PropTypes.func.isRequired,
  saveIsBusy: PropTypes.bool.isRequired,
  searchIsBusy: PropTypes.bool.isRequired
}

ThreadDetailsModal.defaultProps = {
  thread: {
    id: undefined,
    name: '',
    description: '',
    twitterProfile: {
      id: '',
      username: ''
    }
  }
}
