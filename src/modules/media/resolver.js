import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { Uploads } from "../../models/files.js";
import { tokenVerify } from "../../utils/tokenVerify.js";
import { jwtverify } from "../../utils/jwt.js";

export default {
  Query: {
    getMedia: async () => {
      const media = await Uploads.findAll({
        attributes: ["id", "url", "desc", "likes", "created_at", "user_id"],
      });
      return {
        status: 200,
        message: "Success!",
        data: media.map((el) => el.dataValues),
      };
    },
    getOwnMedia: async (_, args, context) => {
      const { token } = context;
      if (token) {
        const user = jwtverify(token, context);
        if (!user)
          return {
            status: 400,
            message: "You are not login!",
          };

        const media = await Uploads.findAll({ where: { user_id: user.id } });
        return {
          status: 200,
          message: "okay",
          data: media.map((el) => el.dataValues),
        };
      }
      return {
        status: 400,
        message: "You are not login!",
      };
    },
  },

  Mutation: {
    createMedia: async (_, args, context) => {
      const user = await tokenVerify(context);
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

      return {
        status: 400,
        message: "You are not login!",
      };
    },
    updateLike: async (_, args, context) => {
      const user = jwtverify(context.token, context);
      if (!user)
        return {
          status: 200,
          message: "You are not login",
        };
      const { media_id } = args;
      const foundMedia = await Uploads.findOne({ where: { id: media_id } });
      if (!foundMedia)
        return {
          status: 404,
          message: "Media not found",
        };
      let { likes } = foundMedia.dataValues;
      const updateMedia = await Uploads.update(
        { likes: ++likes },
        { where: { id: media_id } }
      );

      const updateFoundMedia = await Uploads.findOne({
        attributes: ["id", "url", "desc", "likes", "created_at", "user_id"],
        where: { id: media_id },
      });

      if (updateMedia[0] === 1)
        return {
          status: 200,
          message: "Success",
          data: [updateFoundMedia.dataValues],
        };
      else
        return {
          status: 400,
          message: "Internal server Error",
        };
    },
  },
};
