import fs from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import packageJson from "../package.json";
import shell from "shelljs";

const targetVersion = packageJson.version;
const __filepath = fileURLToPath(import.meta.url);
const versionPath = resolve(__filepath, "../../src/version.ts");
fs.writeFileSync(versionPath, `export default "${targetVersion}";`, { flag: "w" });
shell.exec("git add ./src/version.ts");
