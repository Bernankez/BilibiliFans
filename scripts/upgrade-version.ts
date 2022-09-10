import { isDefined } from "./utils";

export type VersionType = "major" | "minor" | "patch";

export function upgradeVersion(targetVersion: string): string;
export function upgradeVersion(currentVersion: string, type: VersionType): string;
export function upgradeVersion(version: string, type?: VersionType) {
  if (!isDefined(type)) {
    return version;
  }
  const [major, minor, patch] = version.split(".").map(v => (isNaN(Number(v)) ? 0 : Number(v)));
  switch (type) {
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "major":
      return `${major + 1}.0.0`;
    default:
      return version;
  }
}
