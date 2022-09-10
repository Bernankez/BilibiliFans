import { expect, it, describe } from "vitest";
import { upgradeVersion } from "./upgrade-version";

const currentVersion = "6.5.9";

describe("upgrade version", () => {
  it("newVersion", () => {
    expect(upgradeVersion("1.1.0")).toBe("1.1.0");
  });
  it("patch", () => {
    expect(upgradeVersion(currentVersion, "patch")).toBe("6.5.10");
  });
  it("minor", () => {
    expect(upgradeVersion(currentVersion, "minor")).toBe("6.6.0");
  });
  it("major", () => {
    expect(upgradeVersion(currentVersion, "major")).toBe("7.0.0");
  });
});
