<h1 align="center">GFW Carrier Vessel</h1>

Global Fishing Watch and The Pew Charitable Trusts are working together to improve understanding and management of transshipment at-sea through greater transparency, monitoring and analysis of the activity. The organizations have generated and will maintain a global, public database and monitoring portal of carrier vessels involved in transshipment, and arm relevant authorities with the information and evidence needed to strengthen transparency and accelerate transshipment policy reform -- particularly within the five global tuna regional fisheries management organizations (RFMOs). The shared ambition is to ensure that transshipment does not facilitate illegal fishing -- and to instill confidence that transshipped catch is both legal and verifiable.

## Development
### Quick start (dockerized environment)
#### Prerequisites

We use a dockerized development environment, so you will need [docker](https://www.docker.com/) on your machine and also [docker-compose](https://docs.docker.com/compose/install/).

#### Steps
* Create an environment file at `.env` and ask any team member to provide its contents for you.
* Run `docker-compose up`.
* With this now you can use the app visiting the following url: [http://localhost:3003/](http://localhost:3003/).

### Local setup (not dockerized)

#### Install

```sh
yarn install
```

#### Usage

```sh
yarn start
```

## Deploy configuration

In cloud build configure the next environment variables:

Front:

REACT_APP_API_GATEWAY
REACT_APP_TRACK_INSPECTOR_URL
REACT_APP_DATA_DOWNLOAD_URL
REACT_APP_GOOGLE_TAG_MANAGER_KEY
REACT_APP_GOOGLE_ANALYTICS_GA4
REACT_APP_GOOGLE_TAG_MEASUREMENT_ID
REACT_APP_DATASET_ID

Basic Auth:

BASIC_AUTH_USER => Username for basic auth
BASIC_AUTH_PASS => Password for basic auth
BASIC_AUTH => Basic auth enabled or not. Possible values: "Restricted" or off

### Versioning

If you want change the version of the app, modify the value of the \_APP_VERSION (substitutions part of the file) variable in `cloudbuild.yml` file

Example:

\_APP_VERSION: 0.5.0-beta

## Author

👤 **Satellite Studio**

- Github: [@satellitestudio](https://github.com/satellitestudio)
