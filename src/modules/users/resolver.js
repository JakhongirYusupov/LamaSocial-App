import { Users } from "../../models/index.js";
import { jwtverify } from "../../utils/jwt.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export default {
  Query: {
    getUsers: async () => {
      const users = await Users.findAll({
        attributes: ["id", "username", "email", "avatar_url", "online"],
      });
      if (users) return users.map((el) => el.dataValues);
      throw new Error("Users not found");
    },
  },
  Mutation: {
    updateUser: async (_, args, context) => {
      const { token } = context;
      if (!token)
        return {
          status: 400,
          message: "You are not login!",
        };
      const user = jwtverify(token, context);
      const foundUser = await Users.findOne({ where: { id: user.id } });
      if (!foundUser)
        return {
          status: 200,
          message: "You are not login",
        };
      let { id, username, email, password, avatar_url } = foundUser.dataValues;
      username = args.username ? args.username : username;
      email = args.email ? args.email : email;
      password = args.password ? args.password : password;

      if (args.avatar_url) {
        const { filename, createReadStream } = args.avatar_url.file;
        const fileUrl = `images/${uuidv4()}${path.extname(filename)}`;
        const stream = createReadStream();
        const fileAddress = path.join(process.cwd(), "uploads", fileUrl);
        const out = fs.createWriteStream(fileAddress);
        stream.pipe(out);
        avatar_url = fileUrl;
      }

      const updateUser = await Users.update(
        {
          username,
          email,
          password,
          avatar_url,
        },
        { where: { id: id } }
      );
      if (updateUser[0] === 1)
        return {
          status: 200,
          message: "User successfull update!",
          data: await Users.findOne({ where: { id } }),
        };
      else if (updateUser[0] === 0)
        return {
          status: 400,
          message: "User did not update",
        };
      return {
        status: 500,
        message: "Internal server error",
      };
    },
  },
};
