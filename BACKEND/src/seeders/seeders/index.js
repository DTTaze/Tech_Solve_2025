const { sequelize } = require("../../models");
const roleSeeder = require("./seeder-role");
const permissionSeeder = require("./seeder-permission");
const rolePermissionSeeder = require("./seeder-role_permission");
const userSeeder = require("./seeder-user");
const typeSeeder = require("./seeder-type");
const taskTypeSeeder = require("./seeder-task_type");
const taskSeeder = require("./seeder-task");
const itemSeeder = require("./seeder-item");
const transactionSeeder = require("./seeder-transaction");
const taskUserSeeder = require("./seeder-task_user");

const seeders = [
  { model: require("../../models").Role, seeder: roleSeeder },
  { model: require("../../models").Permission, seeder: permissionSeeder },
  {
    model: require("../../models").RolePermission,
    seeder: rolePermissionSeeder,
  },
  { model: require("../../models").User, seeder: userSeeder },
  { model: require("../../models").Item, seeder: itemSeeder },
  { model: require("../../models").Transaction, seeder: transactionSeeder },
  { model: require("../../models").Task, seeder: taskSeeder },
  { model: require("../../models").Type, seeder: typeSeeder },
  { model: require("../../models").TaskType, seeder: taskTypeSeeder },
  { model: require("../../models").TaskUser, seeder: taskUserSeeder },
];

(async () => {
  try {
    for (const { model, seeder } of seeders) {
      const count = await model.count();
      if (count === 0) {
        console.log(`\x1b[33mSeeding ${model.name}...\x1b[0m`);
        await seeder.up(sequelize.getQueryInterface(), sequelize);
      } else {
        console.log(`\x1b[32mSkipping ${model.name}, already seeded.\x1b[0m`);
      }
    }
    console.log("\x1b[32mAll seeders executed successfully!\x1b[0m");
  } catch (error) {
    console.error("\x1b[31mError executing seeders:\x1b[0m", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
})();
