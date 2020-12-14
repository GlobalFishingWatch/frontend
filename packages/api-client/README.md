# GFW API CLIENT

Simply pure js library to help on the GFW API with:

- login/logout steps
- fetch authenticated resources
- download authenticated resources

## Install

yarn

```bash
yarn add @globalfishingwatch/api-client
```

npm

```bash
npm i @globalfishingwatch/api-client --save
```

## Initialize

Just include the basic config in the `.env` when no extra configuration is needed.
`API_GATEWAY_URL | REACT_APP_API_GATEWAY_URL=https://gateway.api.dev.globalfishingwatch.org`

```js
import GFW_API from '@globalfishingwatch/api-client'
// use where needed
```

Some configuration is exposed to be changed at any moment:

```js
GFW_API.setConfig( {
	debug: boolean
	baseUrl: string
})
```

## Login

The url to the SSO is exposed used the `getLoginUrl` helper, which needs the following params:

- callback url
- client (optional, using gfw by default)

```js
import GFW_API from '@globalfishingwatch/api-client'
const url = GFW_API.getLoginUrl('your_callback_url_here', 'client_optional')
```

1. On the very first usage time the library needs the `access-token` to generate the session `token` and the `refreshToken` but it won't be useful anymore.

```js
try {
  const user = await GFWAPI.login({ accessToken: 'acces_token_here' })
  console.log(user) // returns user data
} catch (e) {
  console.warn('Something happened on the login', e)
}
```

2. Once it was logged for first time you can login using your `refreshToken`:

```js
try {
  const user = await GFWAPI.login({ refreshToken: 'refresh_token_here' })
  console.log(user) // returns user data
} catch (e) {
  console.warn('Something happened on the login', e)
}
```

3. If you want the library to use the stored keys in the localStorage just use:

```js
try {
  const user = await GFWAPI.login()
  console.log(user) // returns user data
} catch (e) {
  console.warn('Something happened on the login', e)
}
```

## Set dataset

As most of the endpoints are below the `dataset` prefix the client allows you to set the dataset version and be used in all request using:

```js
GFWAPI.setConfig({ dataset })
```

## Fetch resources

1. Once the initialization and the login were good to you will be able to consume Global Fishing Watch endpoints data using:

```js
try {
  const data = await GFWAPI.fetch('your_relative_url_here')
  console.log(data) // returns the desired data
} catch (e) {
  console.warn('Something happened on the gfw api fetch', e)
}
```

## Download resources

1. Download resources using your logged account is easily done using the endpoint to download and the file name to store with its extension

```js
try {
  await GFWAPI.download('your_download_url_here', 'downloaded-file-name.csv')
} catch (e) {
  console.warn('An error on the download happened', e)
}
```

### Logout

1. To remove invalidate the current session and removed stored `token` and `refreshToken` just use:

```js
try {
  const logged = await GFWAPI.logout()
  console.log(logged) // returns true when logout was good
} catch (e) {
  console.warn('Something happened on the logout', e)
}
```

### Use it locally

Send `local:true` in the FetchOptions and ensure you have the following .env variables
```
REACT_APP_LOCAL_API_USER_ID=
REACT_APP_LOCAL_API_USER_TYPE=
REACT_APP_LOCAL_API_USER_EMAIL=
```

## FAQ

<details>
<summary>Do you need the token or the refreshToken in your app ?</summary>
<p>

Just use:

```js
GFWAPI.getToken()
// or
GFWAPI.getRefreshToken()
```

</p>
</details>

<details>
<summary>Do you need the debug the requests?</summary>
<p>

Use your [own instance of the API client](#Initialize) including this param:

```js
const GFWAPI = new GFW_API({
	....
	debug: true
})
```

</p>
</details>

## Use it with React

The library exposes a [react hook](https://reactjs.org/docs/hooks-intro.html) to make the login as easy as possible:

```js
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/api-client/dist/react-hook'

function App() {
  const { loading, logged, user, error } = useGFWLogin(GFWAPI)
}
```

## Development

1. Install dependencies

```bash
yarn install
```

2. Start the project with watcher to recompile

```bash
yarn start
```

3. Run the tests

```bash
yarn test
```

4. Build it!

```bash
yarn build
```

5. Prepare the release!

```bash
npx release major|minor|patch
```

6. Publish the new version and update the documentation

```bash
npm publish
npm publishdoc
```
