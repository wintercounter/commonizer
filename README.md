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

### Remove exports only, or transpile only

You may specify if you want to do the removal of `exports` field or
transpilation only.

```json
{
  "commonizer": [
    [
      "node_modules/html-void-elements",
      [
        "node_modules/parse5",
        {
          "exports": true,
          "commonjs": false
        }
      ]
    ]
  ]
}
```

The above example was necessary in my case because other CJS modules were trying
to load scripts directly (eg. `parse5/lib/parse.js`) which were not listed in
the `exports` field and NodeJS prevents this.

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

Below I show an example of a list I have for a bigger, mature project. Works
well there, but I cannot be sure it'll work in every scenario. This is a
temporary solution to help overcome the surfacing issues during a project's
transition period.

```json
{
  "commonizer": [
    "node_modules/chalk",
    "node_modules/figures",
    "node_modules/figures/node_modules/escape-string-regexp",
    "node_modules/is-unicode-supported",
    "node_modules/react-markdown",
    "node_modules/vfile",
    "node_modules/vfile-message",
    "node_modules/unist-util-stringify-position",
    "node_modules/unified",
    "node_modules/bail",
    "node_modules/is-plain-obj",
    "node_modules/trough",
    "node_modules/remark-parse",
    "node_modules/mdast-util-from-markdown",
    "node_modules/mdast-util-to-string",
    "node_modules/micromark",
    "node_modules/micromark-util-combine-extensions",
    "node_modules/micromark-util-chunked",
    "node_modules/micromark-factory-space",
    "node_modules/micromark-util-character",
    "node_modules/micromark-core-commonmark",
    "node_modules/micromark-core-gfm",
    "node_modules/micromark-util-classify-character",
    "node_modules/micromark-util-resolve-all",
    "node_modules/decode-named-character-reference",
    "node_modules/character-entities",
    "node_modules/micromark-util-subtokenize",
    "node_modules/micromark-factory-destination",
    "node_modules/micromark-factory-label",
    "node_modules/micromark-factory-title",
    "node_modules/micromark-factory-whitespace",
    "node_modules/micromark-util-normalize-identifier",
    "node_modules/micromark-util-html-tag-name",
    "node_modules/micromark-util-decode-numeric-character-reference",
    "node_modules/micromark-util-decode-string",
    "node_modules/remark-rehype",
    "node_modules/mdast-util-to-hast",
    "node_modules/unist-builder",
    "node_modules/unist-util-visit",
    "node_modules/unist-util-visit-parents",
    "node_modules/unist-util-visit/node_modules/unist-util-visit-parents",
    "node_modules/unist-util-is",
    "node_modules/unist-util-position",
    "node_modules/unist-util-generated",
    "node_modules/mdast-util-definitions",
    "node_modules/mdast-util-definitions/node_modules/unist-util-visit",
    "node_modules/micromark-util-sanitize-uri",
    "node_modules/micromark-util-encode",
    "node_modules/property-information",
    "node_modules/hast-util-whitespace",
    "node_modules/space-separated-tokens",
    "node_modules/comma-separated-tokens",
    "node_modules/remark-gfm",
    "node_modules/micromark-extension-gfm",
    "node_modules/micromark-extension-gfm-autolink-literal",
    "node_modules/micromark-extension-gfm-footnote",
    "node_modules/micromark-extension-gfm-strikethrough",
    "node_modules/micromark-extension-gfm-table",
    "node_modules/micromark-extension-gfm-tagfilter",
    "node_modules/micromark-extension-gfm-task-list-item",
    "node_modules/mdast-util-gfm",
    "node_modules/mdast-util-gfm-autolink-literal",
    "node_modules/ccount",
    "node_modules/mdast-util-find-and-replace",
    "node_modules/mdast-util-find-and-replace/node_modules/escape-string-regexp",
    "node_modules/mdast-util-find-and-replace/node_modules/unist-util-visit-parents",
    "node_modules/mdast-util-gfm-footnote",
    "node_modules/mdast-util-to-markdown",
    "node_modules/mdast-util-gfm-strikethrough",
    "node_modules/mdast-util-gfm-table",
    "node_modules/markdown-table",
    "node_modules/mdast-util-gfm-task-list-item",
    "node_modules/rehype-raw",
    "node_modules/hast-util-raw",
    "node_modules/hast-util-from-parse5",
    "node_modules/hast-util-from-parse5/node_modules/hastscript",
    "node_modules/hast-util-from-parse5/node_modules/hast-util-parse-selector",
    "node_modules/vfile-location",
    "node_modules/web-namespaces",
    "node_modules/hast-util-to-parse5",
    "node_modules/hast-to-hyperscript",
    "node_modules/zwitch",
    "node_modules/html-void-elements",
    [
      "node_modules/parse5",
      {
        "exports": true,
        "commonjs": false
      }
    ],
    "node_modules/unified/node_modules/is-plain-obj",
    "node_modules/mdast-util-to-hast/node_modules/mdast-util-definitions",
    "node_modules/mdast-util-to-hast/node_modules/mdast-util-definitions/node_modules/unist-util-visit",
    "node_modules/mdast-util-to-hast/node_modules/unist-util-visit-parents"
  ]
}
```

## PS

I didn't read through what I wrote here :)
