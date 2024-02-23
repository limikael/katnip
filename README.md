# katnip

Katnip is a plugin based, zero-configuration javascript web framework.

You can think of Katnip as a command-line plugin runner. This means that it doesn't do much by itself, but rather just establishes a protocol for loading puligns and have them talk to each other. With the right plugins loaded, it then becomes a practical tool for building web-apps with tailored features without the fuss. It has a zero-configuration approach, which means that it is possible to get plugins to run and do their jobs without any need for application-specific code or configuration. It's straightforward, efficient, and all about empowering the developer to a quick and streamlined development experience.

## Getting started

Install `katnip` globally with:

```bash
npm install -g katnip
```

Then, create a new project with

```bash
katnip create my-project
```

Cd into the project folder, and run:

```bash
npm start
```

## Plugins

A plugin is simply an NPM package, that export functions to respond to various hooks. Actually, all the `katnip create` command does, is to create an NPM project, and set a template plugin as dependency. By default, this template is [katnip-twentytwentyfour](https://www.npmjs.com/package/katnip-twentytwentyfour). This template then has other NPM packages as dependencies, so those will be installed, in the same way as any NPM package. It then runs the `init` hook, and it is now up to the various plugins to respond to this hook and do what they see fit.

If you type `katnip` from inside the created project folder, you will see something like:

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

If you run it from outside of a project folder, there will be less commands available. The commands available in the cli are also registered by plugns, and each command results in a hook being sent.

The hooks are run in different *phases*, corresponding to different exports from the plugins. By default, there are 3 phases:

* When we run the `katnip` command from the command line, we are in the `cli` phase. Plugins loaded in this phase will always run in a Node.js environment. Typical hooks here would be `dev` for starting a development server, `build` for building the project, and `deploy` for deploying it.
* When we start a development or production server, we will run in the `server` phase. A typical hook here is `fetch`, which turns a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) into a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response). Plugins operating in this phase are similar to middlewares in frameworks like Express or Hono. The difference is that when using a framework like Express, the programmer is responsible for writing the initialization code that creates an Express app and add middlewares to it. In Katnip, it is rather the plugins that are responsible for "hooking into" the framework, enabling a zero-configuration workflow. 
* There is also the `browser` phase, which is what happens on the client after a user has loaded a page.

To get a better understanding, let's look at what some plugins do and in which phases they operate:

* katnip-tailwind hooks into the `cli` phase to listen to the `build` hook, in order to create a css file. It then also
hooks into the `browser` phase, in order to load the generated css file.
* katnip-quickmin, which is a database admin, hooks into the `cli` phase to listen for the `dev` or `deploy` hooks, to migrate the database schema. It then also hooks into the `server` phase, in order to serve the admin interface on the `fetch` hook.
* katnip-cloudflare hooks into the `cli` phase in order to provide the `cfdeploy` command to build the project and deploy it to cloudflare.

The plugin katnip-twentytwentyfour is a kind of "meta" plugin, that doesn't add any functionality itsef, but rather just has a list of dependencies. The plugins it depends on are:

* [katnip-cloudflare](https://www.npmjs.com/package/katnip-cloudflare) - For deploying the project as a Cloudflare Worker.
* [katnip-isoq](https://www.npmjs.com/package/katnip-isoq) - Uses [Isoq](https://github.com/limikael/isoq) to build isomorphic Preact apps.
* [kantip-quickmin](https://www.npmjs.com/package/katnip-quickmin) - Uses [Quickmin](https://github.com/limikael/quickmin) to provide database related stuff, i.e. schema migration and database administration UI.
* [katnip-rpc](https://www.npmjs.com/package/katnip-rpc) - Provides an easy way for client code to call server code using JSON-RPC.
* [katnip-static](https://www.npmjs.com/package/katnip-static) - Serves static files.
* [katnip-tailwind](https://www.npmjs.com/package/katnip-tailwind) - Compiles and initializes [Tailwind](https://www.tailwindcss.com/).
* [katnip-watch](https://www.npmjs.com/package/katnip-watch) - Hooks in to the developlent server and watches for changed files and restarts the server if they change.
