import minimist from "minimist";
import { resolve } from "path";
import { fileURLToPath } from "url";
import version from "../src/version";
import { upgrade } from "./release.util";
import { upgradeVersion, VersionType } from "./upgrade-version";

const __filepath = fileURLToPath(import.meta.url);

const versionPath = resolve(__filepath, "../../src/version.ts");
const packageJsonPath = resolve(__filepath, "../../package.json");

const argv = minimist(process.argv.slice(2), {
  alias: {
    type: ["t"],
    version: ["v"],
    major: ["ma", "mj"],
    minor: ["mi", "mn"],
    patch: ["pa"],
  },
  default: {
    type: "patch",
  },
});

let type: VersionType = argv.type;
if (argv.major) {
  type = "major";
} else if (argv.minor) {
  type = "minor";
} else if (argv.patch) {
  type = "patch";
}

const targetVersion = argv.version || upgradeVersion(version, type);
upgrade(targetVersion, { version: versionPath, packageJson: packageJsonPath });