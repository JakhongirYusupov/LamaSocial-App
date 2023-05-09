import { Users } from "../models/index.js";
import { jwtverify } from "./jwt.js";

export const tokenVerify = async (context) => {
  const { token } = context;
  const verify = jwtverify(token, context);
  if (!verify) return undefined;

  return await Users.findOne({
    where: { username: verify.username, email: verify.email },
  });
};
