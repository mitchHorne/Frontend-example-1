import styled from 'styled-components'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import {
  ErrorSpan,
  PasswordInputControl,
  TextSpan,
  TvButton,
  TwitterPreview
} from '../components'
import { useThreadManagement } from '../hooks'
import { viewSharedThreadPreview } from '../utils/threadPreview'

const PasswordWrapper = styled.form`
  align-items: center;
  background-color: lightgray;
  display: flex;
  height: 100vh;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
`

const PreviewWrapper = styled.div`
  align-items: flex-start;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 0;
  width: 100%;
  scrollbar-width: none;

  @media screen and (max-width: 530px) {
    padding: 0;
  }
`

const InputWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  width: 100%;

  @media screen and (min-width: 420px) {
    width: 400px;
  }
`

const PasswordLabel = styled(TextSpan)`
  font-weight: 700;
  text-align: center;

  @media screen and (min-width: 420px) {
    text-align: left;
  }
`

export const SharedPreviewContainer = ({ previewId }) => {
  const {
    getTweet,
    goToQuoteTweet,
    masterTweetId,
    onBackClick,
    rootDisplayTweetId,
    setInitialThreadData,
    threadDetails
  } = useThreadManagement()

  const masterTweet = getTweet(masterTweetId)
  const rootDisplayTweet = getTweet(rootDisplayTweetId)

  const passwordForm = useFormik({
    initialValues: { password: '' },
    onSubmit: async values => await loadPreview(values.password),
    validate: values => {
      if (!values.password) return { password: 'Password is required' }

      return {}
    }
  })

  const {
    dirty,
    handleSubmit,
    handleBlur,
    handleChange,
    isSubmitting,
    isValid,
    submitCount,
    values: formValues
  } = passwordForm

  const loadPreview = async password => {
    const result = await viewSharedThreadPreview(previewId, password)
    if (!result) return

    const { nodes, ...threadDetails } = result
    setInitialThreadData(nodes, threadDetails)
  }

  return (
    <>
      {threadDetails && (
        <PreviewWrapper>
          <TwitterPreview
            thread={threadDetails}
            getTweet={getTweet}
            goToQuoteTweet={goToQuoteTweet}
            masterTweet={masterTweet}
            onBackClick={onBackClick}
            rootDisplayTweet={rootDisplayTweet}
          />
        </PreviewWrapper>
      )}
      {!threadDetails && (
        <PasswordWrapper onSubmit={handleSubmit}>
          <InputWrapper>
            <PasswordLabel>Enter password</PasswordLabel>
            <PasswordInputControl
              id='password'
              name='password'
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder='Thread sharing password'
              value={formValues.password}
              disabled={isSubmitting}
              autoComplete='password'
            />
            {submitCount > 0 && !isSubmitting && (
              <ErrorSpan>Incorrect password provided</ErrorSpan>
            )}
            <TvButton
              type='submit'
              disabled={!dirty || !isValid || isSubmitting}
            >
              Submit
            </TvButton>
          </InputWrapper>
        </PasswordWrapper>
      )}
    </>
  )
}

SharedPreviewContainer.propTypes = {
  previewId: PropTypes.string.isRequired
}
