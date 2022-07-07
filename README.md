# commonizer

Convert ESM dependencies to CommonJS

The creation of package was fueled by pure rage. Developers started to ship ESM
only packages which are not able to work with CommonJS. This would be fine if
NodeJS would provide full interoperability between the different module specs,
but instead it's breaking the ecosystem that actually was supporting this
through transpilers.

Some projects cannot use ESM or cannot switch easily their code to be async,
which is required to import ESM modules inside CommonJS modules. There is simply
no way for some projects to update to the latest version of some crucial
packages, and there's no way they can patch their security vulnerabilities if
their package is ESM only.

`commonizer` will give an option for those in need until they can upgrade their
code to be ESM only as well.

This package will:

- transpile ESM modules to CommonJS modules using SWC
- remove `exports` field from their `package.json`

## Usage

### Installation

```sh
# Locally
npm i commonizer --save-dev

# Globally
npm i commonizer -g
```

### Specifying modules to transpile

Inside your `package.json`, under `commonizer` property, you can specify which
modules you want to transpile.

- You need to specify one by one.
- It won't transpile a module's dependencies, you need to specify them
  separately if necessary, one-by-one.

```json
{
  "commonizer": [
    "node_modules/chalk",
    "node_modules/figures",
    "node_modules/figures/node_modules/escape-string-regexp"
  ]
}
```

### Run `commonizer`

```sh
npx commonizer
```

## FAQ

### Why not transpile dependencies of a module also?

To keep it safe. Users can decide exactly what to transpile. We don't want to
transpile CommonJS code "by accident".

### Why I need to specify `node_modules` also?

`commonizer` will transpile any path you want, not just node_modules.

### How to know which modules to specify?

NodeJS will throw an error when you encounter such.

```
Error [ERR_REQUIRE_ESM]: require() of ES Module /home/user/project/node_modules/esm-module/index.js
from /home/user/project/my-commonjs-file.js not supported.
```

Use the path `node_modules/esm-module`.

### Can I restore the original source code for a module?

`commonizer` will first create a backup of the original module.

`node_modules/esm-module => node_modules/esm-module__original`

Simply delete the transpiled folder and rename the backup.

### How safe is this method?

Blow I show an example of a list I have for a bigger, mature project. Works well
there, but I cannot be sure it'll work in every scenario. This is a temporary
solution to help overcome the surfacing issues during a project's transition
period.

## PS

I didn't read through what I wrote here :)
