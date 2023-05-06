export default {
  Query: {
    register: async (parent, args) => {
      console.log(parent);
      console.log(args);
      console.log(context);
      return "Hello";
    },
  },
  Mutation: {
    register: async (_, args) => {
      console.log(args);
      return {
        status: 200,
        message: "Success!",
      };
    },
  },
};
