# Katnip

* [Introduction](#introduction)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [Plugins](#plugins)

## Introduction

Katnip is a minimal full-stack framework for building isomorphic React apps that run seamlessly on the edge or locally.

It uses Mikrokat for deployment, and adds:

- Isomorphic React rendering, (SSR + hydration).
- Automatic database schema migration and admin.
- Database access layer.
- Direct server function calls from the client (JSON-RPC).

Katnip aims to let you build and deploy immediately while staying lightweight and easy to understand.

## Getting Started

### 1. Create a new project

```bash
mkdir my-app
cd my-app
npx katnip init
```

You might also want to install the `katnip` command line tool globally:

```bash
npm install -g katnip
```

### 2. Install project dependencies

Using **npm**:

```bash
npm install
```

You can also use `yarn` or `pnpm`, of course. If you use `pnpm` you need to approve builds using:

```bash
pnpm approve-builds
```

This is because katnip uses `better-sqlite3` for local development.

### 3. Run the development server locally

```bash
npm start
```

Your app will be available at [http://localhost:3000](http://localhost:3000).

And you can find the database admin at [http://localhost:3000/admin](http://localhost:3000/admin).
The default username and password is `admin`/`admin`. 

### 4. Add an edge platform, test and deploy

To add support for an edge platform, run:

```bash
katnip init --platform=cloudflare
```

To run your app in a simulated edge envirunment, run:

```bash
katnip dev --platform=cloudflare
```

Then, to deploy:

```bash
katnip deploy --platform=cloudflare
```

In the examples above, `cloudflare` is the edge provider.
Supported edge providers are `cloudflare`, `vercel`, `fastly` and `netlify`.

## Project Structure

By default, a Katnip project has:

```
my-app/
  src/
    main/
      index.jsx     # Client entrypoint
      server.js     # Server entrypoint
  quickmin.yaml     # Database schema
  katnip.json       # Project configuration
```

Also, see the default `katnip.json` file for information about how to enable features.

## Plugins

Katnip has plugin support. Plugins are installed as regular npm packages, and Katnip will auto-discover
them, so no further installation is needed. Available plugins:

* [katnip-payment](https://www.npmjs.com/package/katnip-payment) - Enables stripe payments.
