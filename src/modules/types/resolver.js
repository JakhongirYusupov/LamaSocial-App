import { GraphQLScalarType } from "graphql";

const passwordScalar = new GraphQLScalarType({
  name: "Password",
  description:
    "This type checks must be password(must be character, be string, be number)",
  // serialize,
  // parseValue,
  // parseLiteral,
});

export default {
  Password: passwordScalar,
};
