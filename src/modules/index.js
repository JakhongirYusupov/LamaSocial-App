import { makeExecutableSchema } from "@graphql-tools/schema";
import Register from "./register/index.js";
import Types from "./types/index.js";
import Media from "./media/index.js";

export default makeExecutableSchema({
  typeDefs: [Register.typeDefs, Types.typeDefs, Media.typeDefs],
  resolvers: [Register.resolvers, Types.resolvers, Media.resolvers],
});
