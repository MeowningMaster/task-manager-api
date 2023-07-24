# task-manager-api
Claimr technical assignment

## Hosted API
API is hosted on Digital Ocean. Visit [interactive documentation](http://146.190.178.107:5000/documentation)

## How to run
1. Clone this repository
2. Install [Docker](https://docs.docker.com/get-docker/)
3. Copy `config.docker.template.yaml` file as `config.docker.yaml`
4. (Optional) Provide `.env` file to change MySQL credentials in `docker-compose.yml`. Reflect changes to `config.docker.yaml`
5. Run `docker compose up -d`
6. Done! Visit [documentation](http://localhost:5000/documentation)

## Technical overview
- REST server via [Fastify](https://fastify.dev/)
  - validation and documentation from one source via [typebox](https://github.com/sinclairzx81/typebox)
  - JWT authentification
  - rate limiting
  - pagination, filtering, and sorting for list queries
  - comprehensive error handling
- Logging via [pino](https://getpino.io/)
- Simple [inverse on control container](./src/ioc/index.ts)
  - clean server components structure with automatic resolution
  - disable unnecessary dependencies during tests via [`partial`](./src/ioc/partial.ts)
  - does not use decorators and `reflect-metadata`, so the server can be built via [esbuild](https://esbuild.github.io/) in future
- MySQL & [Drizzle ORM](https://orm.drizzle.team/)
  - describe database schema
  - powerful query builder
  - typescript types via inference
  - generate and run migrations
- Email sender via [NodeMailer](https://nodemailer.com/about/)
  - emails are sent from [Ethereal](https://ethereal.email/), so they won't be delivered to the end user!
  - [check emails](https://ethereal.email/login)
    - login: `willis.grady@ethereal.email`
    - password: `8WAQYgceSW5MghHU7Y`
- Redis & [BullMQ](https://docs.bullmq.io/)
  - persistent scheduling of notifications
- Unit tests via [Vitest](https://vitest.dev/)
- Deployment via Github Actions. [Workflow](./.github/workflows/deploy.yml)

## Development setup
- Install [Volta](https://docs.volta.sh/guide/getting-started)
- Install Node.js: `volta install node`
- Install [pnpm](https://pnpm.io/): `volta install pnpm`
- Install dependencies: `pnpm install`
- Copy `config.template.yaml` file as `config.yaml`
- Setup MySQL and Redis, edit hosts and credentials in `config.yaml`

### Now you can
- Run project: `pnpm start` or launch debug in vscode
- Run unit tests: `pnpm test`
- Generate SQL migrations from database schemas: `pnpm migrate`