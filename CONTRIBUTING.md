# Contributing

## Requirements

Required to run [docker-compose](https://docs.docker.com/compose/)

## Getting Started

```sh
git clone git@github.com:ymaps/ymaps3-test-server.git
cd ymaps3-test-server
touch .env
```

Editing the `.env` file. In it, we indicate with what login and password the test database will be created and how to connect to it.

In this format:

```dotenv
DATA_PROVIDER="db"
DB_NAME=api
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=secret007
PGADMIN_DEFAULT_EMAIL=postgres@admin.com
PGADMIN_DEFAULT_PASSWORD=qwertyuiop
PORT=8080
HOST=0.0.0.0
DISABLE_LOGGING=false
POINTS_JSON="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_1_label_points.geojson"
ORIGINS="http://localhost:3000"
```

-   `DISABLE_LOGGING` - disable logging
-   `DATA_PROVIDER` can be `db` or `json`
-   `POINTS_JSON` - link to the geojson file with points for json data provider
-   `DB_PASSWORD` and `DB_USER` make your own, they will be used both when initializing the database and when connecting to it
-   `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` Needed to connect to [pgAdmin](https://www.pgadmin.org/), you don't have to set them if you don't use this service

We start services:

```sh
docker-compose up -d
```

The test application, the database server and the pgadmin database administrator will be raised
The `api` database and the `points` table will be automatically created in the database.

You can check if it works by opening `http://localhost:8080`

To view the database, you can visit http://localhost:8999/browser/ login and password from `.env`

For local development, it is enough to start only the database:

```sh
docker-compose up db -d
```

In file

And start the server in debug mode:

```sh
npm start
```

Any changes to the files will automatically restart the test server.

## Testing

To run autotests:

```sh
npm test
```

## Deployment

When you're done, update the version, add the new tag, and push everything to github.
GitHub actions will automatically roll out the new version to heroku.

## Project structure

- `compose` - Folder with data to start services via docker compose
- `docs` - API specification in [OpenAPI](https://www.openapis.org/) format
- `src` - TypeScript code
  - `app` - application's code
  - `tests` - auto-tests
  - `tools` - special tools
