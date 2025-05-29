# Nutrien Backend Technical Assessment

See [INSTRUCTIONS.md](/INSTRUCTIONS.md) for some background on what we're building.

## Getting Started

To boot up in Development mode, run:

```sh
docker-compose up -d
npm run docker:migrate
```

(Alternatively, run without `-d` to attach to the running services then run the migrations from a new terminal)

This will run and attach to necessary processes. Everything (installing dependencies, booting up, connecting to the database, etc) is handled by Docker. Sourcecode is mounted directly into the service container for development and does not represent a Production-ready build. File changes will restart the server to assist in active development.

## Testing

// TODO

## Entrypoint for Interviewers

Probably jump straight to `src/index.ts` to see my Express instantiation. You can follow that to the requested Histogram route at `src/routes/histogram.ts`.

The database setup is handled in `src/db/index.ts` to connect to Postgres, then the `db` object is connected to Requests as middleware via `useDb.ts` plugged into `app.use(useDb)`. I'm aware that we should create a Pool of connections that Requests can each use but that's more of a discussion topic or stretch goal than interview-MVP.

The `docker-compose.yml` shows that there is a Postgres db set up, then its credentials are bassed as a `DATABASE_URL` to the service which blindly connects to the database.

From there I've modeled a `src/db/schema/projection.ts` Schema after the provided Projection2021.csv file to convert the CSV to Database entries. The database will be re-seeded on each restart by design.

### To Test

```sh
> docker-compose up -d
> curl localhost:3000/Commodity/histogram
[{ key: "Rice", value: 216 }]
> docker-compose down
```

### Cleanup

postgres and the anonymous node_modules volumes were likely created on your computer. From this root directory, run `docker-compose down -v` to shut down and clean up the unnecessary volumes.
