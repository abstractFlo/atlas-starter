# Notes about upcoming Atlas Version 3.1
If the new version 3.1 is released, this respository would be archived and no more maintained. The new Atlas CLI has a build in Command for bootstrap a clean new project.

# Atlas Framework Starter for creating nice gamemodes with alt:V

It lives at https://github.com/abstractFlo/atlas-starter/tree/docker.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit abstractFlo/atlas-starter gamemode
cd gamemode
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

## Get started

Install the dependencies...

```bash
cd gamemode
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run watch
```

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```
