import { Users } from "../models/index.js";
import { jwtverify } from "./jwt.js";

export const tokenVerify = async (token, context) => {
  const verify = jwtverify(token, context);
  if (!verify)
    return {
      status: 400,
      message: "You are not login!",
    };

  return await Users.findOne({
    where: { username: verify.username, email: verify.email },
  });
};
