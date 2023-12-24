# Simple To-Do App

Stupid simple, mobile first PWA to keep track of to-do's. Built with React, Vite, Typescript, and Supabase.

Prompted by [@cameron on Farcaster](https://warpcast.com/greg/0xef8ab635).

## How to run locally:

Requirements: [Node.js](https://nodejs.org/en/download/), [Yarn](https://classic.yarnpkg.com/en/docs/install/), [Docker](https://docs.docker.com/get-docker/), [Supabase CLI](https://supabase.com/docs/guides/cli)

**In the project directory**, create a local Supabase instance. This will create all the tables for you.

```
supabase start
```

Create a `.env` file with the Supabase secrets from the CLI output.

```
cp .env.example .env
```

Install dependencies.

```
yarn install
```

Run the app.

```
yarn dev
```
