import { Auth0Provider } from '@auth0/auth0-react'
import { Helmet } from 'react-helmet'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'

function App () {
  const {
    REACT_APP_AUTH0_CLIENT_ID,
    REACT_APP_AUTH0_DOMAIN,
    REACT_APP_BASE_URL,
    REACT_APP_BACKEND_URL
  } = process.env

  return (
    <Auth0Provider
      domain={REACT_APP_AUTH0_DOMAIN}
      clientId={REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${REACT_APP_BASE_URL}/login/callback`,
        audience: REACT_APP_BACKEND_URL,
        scope: 'read:current_user'
      }}
    >
      <Helmet>
        <script
          type='text/javascript'
          src='https://upload-widget.cloudinary.com/global/all.js'
        />
      </Helmet>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Auth0Provider>
  )
}

export default App
