#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

const swc = require("@swc/core");
const glob = require("glob");

const pkg = require(path.resolve(process.cwd(), "./package.json"));
if (pkg.commonizer) {
  pkg.commonizer.forEach((conf) => {
    const [name, { commonjs = true, exports = true }] =
      typeof conf === "string" ? [conf, {}] : conf;
    const folderPath = path.resolve(process.cwd(), name);
    const originalPath = path.resolve(process.cwd(), `${name}__original`);
    const packageJSONPath = path.resolve(folderPath, "package.json");
    let packageJSON;

    try {
      packageJSON = require(packageJSONPath);
    } catch (e) {
      console.log(
        `${name} is not a valid package. package.json was not found at ${packageJSONPath}`
      );
      return;
    }

    if (fs.existsSync(originalPath)) {
      console.log(`${name} already commonized, skipping...`);
      return;
    }

    fs.copySync(folderPath, originalPath);

    packageJSON.type = "commonjs";
    if (exports) {
      delete packageJSON.exports;
    }
    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2));

    if (commonjs) {
      glob
        .sync(`${folderPath}/**/*.js`, { ignore: ["node_modules"] })
        .forEach((filePath) => {
          const file = fs.readFileSync(filePath, "utf8");
          swc
            .transform(file, {
              jsc: {
                parser: {
                  syntax: "ecmascript",
                },
                transform: {},
              },
              module: {
                type: "commonjs",
              },
            })
            .then((output) => {
              fs.writeFileSync(filePath, output.code);
            });
        });
    }
    console.log(`${name} commonized`);
  });
}
console.log("Done!");
