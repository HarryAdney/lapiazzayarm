const fs = require("fs");

const lock = JSON.parse(fs.readFileSync("package-lock.json"));
const deps = lock.dependencies || {};

const packageJson = {
  name: "recreated-project",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {
    start: "node index.js",
  },
  dependencies: {},
  devDependencies: {},
};

// Recursive function to traverse the tree
function collectDeps(depsObj, parentIsDev = false) {
  for (const [name, info] of Object.entries(depsObj)) {
    const isDev = info.dev || parentIsDev;

    // Add only if not already in package.json
    if (isDev) {
      if (!packageJson.devDependencies[name]) {
        packageJson.devDependencies[name] = info.version;
      }
    } else {
      if (!packageJson.dependencies[name]) {
        packageJson.dependencies[name] = info.version;
      }
    }

    // Recurse into nested dependencies
    if (info.dependencies) {
      collectDeps(info.dependencies, isDev);
    }
  }
}

// Start collecting dependencies
collectDeps(deps);

fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
console.log(
  "package.json recreated with nested dependencies and devDependencies!"
);
