const shell = require('shelljs');
const fs = require('file-system');
const path = require('path');

const args = process.argv.slice(2);
const installDependenciesCmd = "npm install";
const individualComponentBuildCmd = (args[0] === "prod") ? "npm run build-prod" : (args[0] === "dev") ? "npm run build-dev" : "npm run build-prod";
let ignoreComponents = [
  "sample-component",
  "build",
  "node_modules"
];

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
  fs.readdirSync(source).map(name =>
    path.join(source, name)
  ).filter(isDirectory);

let rootDir = process.cwd();
let frontendPath = path.parse(rootDir).dir;
let componentsPath = path.join(frontendPath, "components");
let componentsPathList = getDirectories(componentsPath);
componentsPathList = componentsPathList.filter(folder => ignoreComponents.indexOf(path.parse(folder).base) < 0);
let componentsNameList = componentsPathList.map(folder => path.parse(folder).base);
let componentsCount = componentsNameList.length;

console.info("\n");

// Build polymer components
console.group();
console.info("--- Begin Building Polymer Components ---");
console.info("\n");
console.info("Components Root Path: " + componentsPath);

console.info("Components:");
console.group();
for (let name of componentsNameList) {
  console.log("* " + name);
}
console.groupEnd();

console.log("\nBuilding components...");

shell.cd(componentsPath);
// If this component path doesn't have dependencies installed yet, install them
// before building the component.
let npmPackagePath = path.join(componentsPath, "node_modules");
let isPackagesInstalled = fs.existsSync(npmPackagePath);
if (!isPackagesInstalled) {
  console.log("\nInstalling missing dependencies. It'll just take a sec!\n");
  let installResult = shell.exec(installDependenciesCmd);
  let isInstallError = installResult.code !== 0;
  if (isInstallError) {
    process.exit(1);
  }
}
let buildResult = shell.exec(individualComponentBuildCmd);
let isBuildError = buildResult.search(/(\(\s*(?!0\s*error)\d*\s*error)/g) > -1;
if (isBuildError) {
  process.exit(2);
}

shell.cd(rootDir);
console.info("\n");
console.info("--- Complete Building Polymer Components ---");
console.groupEnd();

console.info("\n");

// Copy bundled components to local source
let srcPath =  path.join(rootDir, "src");
let destDir = "web_components";
let destPath = path.join(srcPath, destDir);
let isDestDirExists = fs.existsSync(destPath);

console.group();
console.info("--- Begin Copying Polymer Components ---");
console.info("\n");
console.info("Local Root Path: " + destPath);

if (isDestDirExists) {
  fs.rmdirSync(destPath);
}
fs.mkdirSync(destPath);

let srcBundlePath = path.join(componentsPath, "build");
let name = "main";
let destComponentDir = path.join(destPath, name);
console.log("Copying: " + name);
fs.mkdirSync(destComponentDir);
fs.copySync(srcBundlePath, destComponentDir);

console.info("\n");
console.info("--- Complete Copying Polymer Components ---");
console.groupEnd();

console.info("\n");
