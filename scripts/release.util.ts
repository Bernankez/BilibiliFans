import fs from "fs";

export function upgrade(targetVersion: string, paths: { version: string; packageJson: string }) {
  const { version: versionPath, packageJson: packageJsonPath } = paths;
  console.log(`==== Start upgrading version ====`);
  const packageJsonPlain = fs.readFileSync(packageJsonPath, { encoding: "utf-8" });
  const newPackageJsonPlain = replace(packageJsonPlain, "version", targetVersion);
  fs.writeFileSync(versionPath, `export default "${targetVersion}";`, { flag: "w" });
  fs.writeFileSync(packageJsonPath, newPackageJsonPlain, { flag: "w" });
  console.log(`==== ${versionPath}, ${packageJsonPath} has been updated ====`);
  console.log(`==== New version ${targetVersion}`);
}

function replace(str: string, prop: string, value: string) {
  // 替换package.json version字段
  // 这种替换方式会保留换行符
  const arr = prop.split(".");
  const length = arr.length;
  const lastItem = arr[length - 1];

  let i = 0;
  // 按行分割代码
  let strArr = str.split(/\n/);
  for (let index = 0; index < strArr.length; index++) {
    // 遍历每行
    const item = strArr[index];
    // 匹配对象键名
    if (new RegExp(`"${arr[i]}"`).test(item)) ++i;
    if (i === length) {
      // 匹配到最后一级
      const hasComma = /,/.test(item);
      strArr[index] = item.replace(
        // 匹配 "value" : <value>  [\s\S]*是匹配一切的通配符，包括换行符
        new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`),
        `"${lastItem}": ${JSON.stringify(value)}${hasComma ? "," : ""}`
      );
      break;
    }
  }
  return strArr.join("\n");
}
