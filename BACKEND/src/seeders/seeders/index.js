const { execSync } = require("child_process");

const commands = [
  "docker compose exec backend npx sequelize-cli db:seed --seed seeder-role.js",
  "docker compose exec backend npx sequelize-cli db:seed --seed seeder-permission.js",
  "docker compose exec backend npx sequelize-cli db:seed --seed seeder-role_permission.js",
  "docker compose exec backend npx sequelize-cli db:seed --seed seeder-user.js",
];

try {
  commands.forEach((cmd) => {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
  });
  console.log("All seeders executed successfully!");
} catch (error) {
  console.error("Error executing seeders:", error);
  process.exit(1);
}
