powershell -Command "Clear-Host"
docker compose exec backend npx sequelize-cli db:seed --seed seeder-role.js
docker compose exec backend npx sequelize-cli db:seed --seed seeder-permission.js
docker compose exec backend npx sequelize-cli db:seed --seed seeder-role_permission.js
docker compose exec backend npx sequelize-cli db:seed --seed seeder-user.js