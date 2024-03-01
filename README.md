# Introduction
Welcome to the Katnip documentation!


## What is Katnip
You can think of Katnip as a command-line JavaScript plugin runner. It doesn't do much by itself. Its main function is to establish a protocol for loading plugins and to have them communicate with each other.
## So what are plugins?
A plugin is an NPM package that exports functions to respond to various hooks..
## Zero configuration
Katnip takes a zero-configuration approach, which means that it is possible to get plugins to run and perform their tasks without any need for application-specific code or configuration.
## Katnip global install
To install globally run
```bash
npm install -g katnip
```

## A Katnip project
A Katnip project is just a collection of JS plugins talking to each other. With that, Katnip comes with a pre-defined set of plugins wrapped up in a template. A template is a meta NPM package – 'meta' because all it contains is a `package.json` with a list of plugins as dependencies. The pre-defined default template is [katnip-twentytwentyfour](https://www.npmjs.com/package/katnip-twentytwentyfour).

## Create a Katnip project with default template
Use the following command to create a Katnip project with the [katnip-twentytwentyfour](https://www.npmjs.com/package/katnip-twentytwentyfour) template:
```bash
$ katnip create my-project
$ cd my-project
```

### Plugins included in the default template
[katnip-twentytwentyfour](https://www.npmjs.com/package/katnip-twentytwentyfour) comes with the following plugins:
- *[katnip](https://www.npmjs.com/package/katnip):* Katnip serves both as a CLI tool and a library, which is why it's included here.
- *[katnip-cloudflare](https://www.npmjs.com/package/katnip-cloudflare):*
Used for deploying the project as a Cloudflare Worker.
- *[katnip-isoq](https://www.npmjs.com/package/katnip-isoq):* Utilizes [Isoq](https://github.com/limikael/isoq) to build isomorphic Preact apps.
- *[katnip-quickmin](https://www.npmjs.com/package/katnip-quickmin):*
Leverages [Quickmin](https://github.com/limikael/quickmin) to provide database-related functionality, such as schema migration and a database administration UI. Bonus point, it also allows data sync between local and remote instances.
- *[katnip-rpc](https://www.npmjs.com/package/katnip-rpc):*
Provides an easy way for client code to call server code using JSON-RPC.
- *[katnip-static](https://www.npmjs.com/package/katnip-static):*
Serves static files.
- *[katnip-tailwind](https://www.npmjs.com/package/katnip-tailwind):*
Compiles and initializes [Tailwind](https://www.tailwindcss.com/).
- *[katnip-watch](https://www.npmjs.com/package/katnip-watch):*
Hooks into the development server, watches for changed files, and restarts the server if they change.

### Running a Katnip project with the default template
Just use `npm start` to run the project
```bash
npm start
```

Go to `http://localhost:3000` to access the project
Got to `localhost:3000/admin` to access the Database admin interface

## The Katnip CLI 
To see the options provided by the Katnip CLI use the command `katnip` without CLI args

```bash
katnip
```

The output depends on where you run the command. If you are inside a Katnip project the output will look like this 

```bash
Usage:
  katnip <command> [options]

Commands:
  katnip dev        Start development server.
  katnip init       Initialize plugins.
  katnip create     Create a new project.
  katnip cfdev      Start wrangler development server.
  katnip cfdeploy   Deploy to Cloudflare Workers.

Global Options:
  --help            Get help for specified command.
  --version         Print version.
  --publicDir=...   Directory to serve as plain static assets. Default: public
```

If you are outside a Katnip project there the commands are fewer.

**Katnip CLI commands under the hood**
When you run any of the CLI commands, let's take `katnip dev` as an example, a `dev` hook/event is triggered. The `katnip create` command triggers the `init` hook.

## Plugins
A plugin is simply an NPM package that exports functions to respond to various hooks/events.

Hooks/events run in different phases, each corresponding to different exports from the plugins. By default, there are three phases:

**CLI phase:** When we run the `katnip` command from the command line, we are in the CLI phase. Plugins loaded in this phase will always run in a Node.js environment. Typical hooks/events here include `dev` for starting a development server, `build` for building the project, and `deploy` for deploying it.

**Serve phase:** The serve phase occurs when we start a development or production server. A typical hook here is `fetch`, which turns a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) into a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response). Plugins operating in this phase are similar to middlewares in frameworks like Express or Hono. The difference is that when using a framework like Express, the programmer is responsible for writing the initialization code that creates an Express app and adds middlewares to it. In Katnip, it is the plugins that are responsible for "hooking into" the framework, enabling a zero-configuration workflow.

**Browser phase:** The browser phase is what happens on the client after a user has loaded a page.
To gain a better understanding, let's examine the actions of some plugins and the phases in which they operate:

*katnip-tailwind:* Hooks into the `cli` phase to listen for the `build` hook, creating a CSS file. It also hooks into the `browser` phase to load the generated CSS file.

*katnip-quickmin:* As a database admin tool, it hooks into the `cli` phase to listen for the `dev` or `deploy` hooks, facilitating the migration of the database schema. Additionally, it hooks into the `server` phase to serve the admin interface on the `fetch` hook.

*katnip-cloudflare:* Hooks into the `cli` phase to provide the `cfdeploy` command, enabling the building of the project and its deployment to Cloudflare.
