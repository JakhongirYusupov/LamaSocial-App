import path from "path";
import fs from "fs";
import { Users } from "../../models/index.js";
import { Uploads } from "../../models/index.js";

// Users.sync({ force: false });
Uploads.sync({ force: false });

export default {
  Query: {
    register: async (parent, args) => {
      return "Hello";
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

        const { filename, createReadStream } = file;
        const stream = createReadStream();
        const fileAddress = path.join(
          process.cwd(),
          "uploads/images",
          filename
        );
        console.log(fileAddress);
        const out = fs.createWriteStream(fileAddress);
        stream.pipe(out);

        const user = await Users.create({
          username,
          email,
          password,
          avatar_url: filename,
        });

        console.log(user);
        return {
          status: 200,
          message: "Success!",
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
