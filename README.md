# Nutrien Backend Technical Assessment

See [INSTRUCTIONS.md](/INSTRUCTIONS.md) for some background on what we're building.

## Getting Started

To boot up into Development mode, run:

```sh
docker-compose up -d
npm run docker:migrate
```

(Alternatively, run without `-d` to attach to the running services then run the migrations from a new terminal)

This will run and attach to necessary processes. Everything (installing dependencies, booting up, connecting to the database, etc) is handled by Docker. Sourcecode is mounted directly into the service container for development and does not represent a Production-ready build. File changes will restart the server to assist in active development.

## Testing

**Unit tests are not currently working.**

I attempted to replicate a lightweight approach to a complex setup from my prior role which ended up being far more involved than I have time to finish implementing. You can check `histogram.test.ts` to see what I have scaffolded but Jest+Node22 is running into ESM issues documented [here](https://github.com/jestjs/jest/issues/9430) and [here](https://github.com/jestjs/jest/pull/10976) (via [here](https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/)), however the fixes I attempted didn't work right away.

Even when those are solved, there's some Postgres hitches to figure out. I posit that endpoints that read from and write to a database should actually read and write to that database, trigger any functions, constraints, unique indexes, etc., but getting a Test Database stood up, with migrations, and reset between tests will again take more time than I have for this assessment.

## Entrypoint for Interviewers

Probably jump straight to `src/index.ts` to see my Express instantiation. You can follow that to the requested Histogram route at `src/routes/histogram.ts`.

The database setup is handled in `src/db/index.ts` to connect to Postgres, then the `db` object is connected to Requests as middleware via `useDb.ts` plugged into `app.use(useDb)`. I'm aware that we should create a Pool of connections that Requests can each use. Seems like a great discussion topic.

From there I've modeled a `src/db/schema/projection.ts` Schema after the provided Projection2021.csv file to convert the CSV to Database entries. The database will be re-seeded on each restart by design.

The `docker-compose.yml` sets up a Postgres db for development, then its credentials are passed as a `DATABASE_URL` to the service which blindly connects to the database.

Finally see `histogram.test.ts` for an example test suite. As stated up above in [Testing](#testing), tests don't currently run due to some Jest+ESM issues. Once solved, in theory I can stand up a test database and a test `DATABASE_URL` to run against, but we didn't quite get that far.

### To Try it Out

```sh
> docker-compose up -d
> npm run docker:migrate
> curl -X POST localhost:3000/seed
> curl localhost:3000/Commodity/histogram
[{ key: "Rice", value: 216 }, ...]
> docker-compose down -v
```

### Cleanup

postgres and the anonymous node_modules volumes were likely created on your computer. From this root directory, run `docker-compose down -v` to shut down and clean up the unnecessary volumes.
