# Simple Todo App

Stupid simple, mobile first PWA to keep track of todos. Built with React, Vite, Typescript, and Supabase.

Prompted by [@cameron on Farcaster](https://warpcast.com/greg/0xef8ab635).

## How to run locally

Requirements: [Node.js](https://nodejs.org/en/download/), [Yarn](https://classic.yarnpkg.com/en/docs/install/), [Docker](https://docs.docker.com/get-docker/), [Supabase CLI](https://supabase.com/docs/guides/cli)

**In the project directory**, create a local Supabase instance. This will create all the tables for you.

```
supabase start
```

Create a `.env` file to configure Supabase with the CLI output values.

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

## How to deploy

Create a new Supabase project from their [dashboard](https://supabase.com/dashboard/projects) (or CLI), then connect to it from the CLI.

```
supabase link --project-ref <project-id>
```

Push our local database schema to the remote database.

```
supabase db push
```

In the Supabase dashboard, navigate to Authentication > Providers and [follow these instructions](https://supabase.com/docs/guides/auth/social-login/auth-google?platform=web#configuration-web) to set up Google OAuth.
