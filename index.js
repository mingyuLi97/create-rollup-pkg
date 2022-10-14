#!/usr/bin/env node

const fs = require("fs-extra");
const prompts = require("prompts");
const path = require("path");
const chalk = require("chalk");
const { validateName, install } = require("./utils");
const pkgName = process.argv[2];

validateName(pkgName);

const dir = path.resolve(
  pkgName.startsWith("@") ? pkgName.split("/")[1] : pkgName
);

async function getOption() {
  const options = await prompts([
    {
      name: "name",
      type: "text",
      message: "项目名称",
      initial: pkgName,
    },
    {
      name: "desc",
      type: "text",
      message: "项目描述",
    },
    {
      name: "useTS",
      type: "confirm",
      initial: true,
      message: "是否创建 TS 项目",
    },
    {
      name: "packageManager",
      type: "select",
      choices: ["pnpm", "yarn", "npm"].map((i) => ({ title: i, value: i })),
      message: "请选择要使用的包管理工具",
    },
  ]);
  return options;
}

(async function () {
  if (fs.existsSync(dir)) {
    const { yes } = await prompts({
      name: "yes",
      type: "confirm",
      message: chalk.bold("Do you want to overwrite them?"),
      initial: true,
    });
    if (!yes) process.exit(1);

    console.log(`Removing ${chalk.cyan(dir)}...`);
    await fs.remove(dir);
  }

  fs.mkdirpSync(dir);

  const options = await getOption();

  await generate(options);

  install(options.packageManager, dir);

  console.log();
  console.log(
    `${chalk.green("✔")} Success! Created ${chalk.cyan(
      pkgName
    )} at ${chalk.cyan(dir)}`
  );
  console.log();
})();

async function generate(options) {
  const { name, desc, useTS } = options;
  fs.copySync(path.resolve(__dirname, "./template/common"), dir);
  if (useTS) {
    fs.copySync(path.resolve(__dirname, "./template/ts"), dir);
  } else {
    fs.copySync(path.resolve(__dirname, "./template/js"), dir);
  }

  // 写入 README
  fs.writeFileSync(path.resolve(dir, "README.md"), `# ${name}\n\n${desc}\n`);
  const pkgPath = path.resolve(dir, "package.json");
  // 修改 package.json
  const json = JSON.parse(fs.readFileSync(pkgPath));

  const bName = path.basename(dir);
  json.name = name;
  json.description = desc;
  json.main = `dist/${bName}.cjs.js`;
  json.module = `dist/${bName}.esm.js`;
  fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2) + "\n");
}
