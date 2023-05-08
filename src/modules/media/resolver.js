import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { Uploads } from "../../models/files.js";
import { tokenVerify } from "../../utils/tokenVerify.js";

export default {
  Query: {
    getMedia: async (_, args) => {
      const { user_id } = args;
      console.log(user_id);
      if (user_id) {
      }
      const media = await Uploads.findAll({
        attributes: ["id", "url", "desc", "likes", "created_at", "user_id"],
      });
      return {
        status: 200,
        message: "Success!",
        data: media.map((el) => el.dataValues),
      };
    },
  },

  Mutation: {
    createMedia: async (_, args, context) => {
      const { token } = context;
      if (token) {
        const user = await tokenVerify(token, context);
        if (!user)
          return {
            status: 400,
            message: "You are not login!",
          };

        const { desc, file } = args;
        const foundMedia = await Uploads.findOne({
          where: { desc, user_id: user.dataValues.id },
        });

        if (foundMedia)
          return {
            status: 400,
            message: "This post already create",
          };

        const { filename, createReadStream } = file.file;
        const fileUrl = `uploads/${uuidv4()}${path.extname(filename)}`;
        const stream = createReadStream();
        const fileAddress = path.join(process.cwd(), "uploads", fileUrl);
        const out = fs.createWriteStream(fileAddress);
        stream.pipe(out);

        const media = await Uploads.create({
          user_id: user.dataValues.id,
          url: fileUrl,
          desc,
          likes: 0,
        });

        if (media) {
          const {
            dataValues: { id, url, desc, likes, created_at, user_id },
          } = media;
          return {
            status: 200,
            message: "Media successfull create!",
            data: [
              {
                id,
                url,
                desc,
                likes,
                created_at,
                user_id,
              },
            ],
          };
        }
      }

      return {
        status: 400,
        message: "You are not login!",
      };
    },
  },
};
