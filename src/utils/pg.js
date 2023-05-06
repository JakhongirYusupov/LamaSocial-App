import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
  username: "postgres",
  database: "lamasocial",
  password: process.env.PG_PASSWORD,
  port: 5432,
  host: "localhost",
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

export { sequelize, DataTypes };
