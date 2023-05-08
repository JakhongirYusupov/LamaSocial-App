import jwt from "jsonwebtoken";
const TOKEN_KEY = process.env.TOKEN_KEY;

const jwtverify = (token, context) => {
  return jwt.verify(
    token,
    TOKEN_KEY + context["user-agent"],
    function (err, decoded) {
      return decoded;
    }
  );
};

const jwtsign = (data, context) => {
  return jwt.sign(data, TOKEN_KEY + context["user-agent"]);
};

export { jwtverify, jwtsign };
