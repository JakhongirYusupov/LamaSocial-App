import { Users } from "./users.js";
import { Uploads } from "./files.js";

Users.hasMany(Uploads, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Uploads.belongsTo(Users);

export { Users, Uploads };
