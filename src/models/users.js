import { sequelize, DataTypes } from "../utils/pg.js";

export const Users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    online: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { tableName: "users" }
);
