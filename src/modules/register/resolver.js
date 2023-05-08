import path from "path";
import fs from "fs";
import { Users } from "../../models/index.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { jwtsign } from "../../utils/jwt.js";

const TOKEN_KEY = process.env.TOKEN_KEY;

// Users.sync({ force: false });
// Uploads.sync({ force: false });

export default {
  Query: {
    login: async (_, args, context) => {
      const { email, password } = args;

      const user = await Users.findOne({
        where: { email, password: jwt.sign(password, TOKEN_KEY) },
      });

      if (!user)
        return {
          status: 404,
          message: "Email or password wrong!",
        };

      const { dataValues } = user;

      const values = {
        id: dataValues.id,
        username: dataValues.username,
        email: dataValues.email,
      };

      return {
        status: 200,
        message: "Success login!",
        token: jwtsign(values, context),
      };
    },
  },
  Mutation: {
    register: async (_, args) => {
      try {
        const {
          username,
          email,
          password,
          avatar_url: { file },
        } = args;

        const foundUsername = await Users.findOne({
          where: { username },
        });
        const foundEmail = await Users.findOne({
          where: { email },
        });

        if (foundEmail || foundUsername)
          return {
            status: 400,
            message: "Username and Email have uniqui!",
          };

        const { filename, createReadStream } = file;
        const fileUrl = `images/${uuidv4()}${path.extname(filename)}`;
        const stream = createReadStream();
        const fileAddress = path.join(process.cwd(), "uploads", fileUrl);
        const out = fs.createWriteStream(fileAddress);
        stream.pipe(out);

        const user = await Users.create({
          username,
          email,
          password: jwt.sign(password, TOKEN_KEY),
          avatar_url: fileUrl,
        });

        if (user) {
          return {
            status: 200,
            message: "User create!",
          };
        }
        return {
          status: 500,
          message: "User did not create",
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
