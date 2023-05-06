import { literal } from "sequelize";
import { DataTypes, sequelize } from "../utils/pg.js";

export const Uploads = sequelize.define("Media", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.CHAR(500),
    allowNull: false,
  },
  desc: {
    type: DataTypes.CHAR(1000),
  },
  likes: {
    type: DataTypes.INTEGER,
  },
  created_at: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: literal("CURRENT_TIMESTAMP"),
  },
});
