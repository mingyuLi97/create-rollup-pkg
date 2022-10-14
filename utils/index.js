const validateProjectName = require("validate-npm-package-name");
const chalk = require("chalk");
const { execSync } = require("child_process");

/**
 * 校验传入的项目名称
 *
 * 名称规则：https://github.com/npm/validate-npm-package-name#naming-rules
 * @param {string} name
 */
function validateName(name) {
  const validationResult = validateProjectName(name);

  function printValidationResults(results) {
    if (typeof results !== "undefined") {
      results.forEach((error) => {
        console.error(chalk.red(`  *  ${error}`));
      });
    }
  }

  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${name}"`
      )} because of npm naming restrictions:`
    );
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);

    process.exit(1);
  }
}

function install(manager, cwd) {
  let cmd = manager === "yarn" ? "yarn" : manager + " i";
  execSync(cmd, {
    stdio: "inherit",
    cwd,
  });
}

module.exports = {
  validateName,
  install,
};
