import { GraphQLScalarType } from "graphql";

function passwordTest(value) {
  if (
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])([a-zA-Z\d@$!%*#?&]){8,15}$/.test(
      value
    )
  ) {
    throw new Error(
      "Invalid password! Password must be [@$!%*#?&][a-zA-Z][0-9]"
    );
  }
  return value;
}

function emailTest(value) {
  if (!(typeof value == "string"))
    throw new Error("Email value must be String!");
  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/.test(
      value
    )
  ) {
    throw new Error("Email value must be valid contact!");
  }
  return value;
}

function mediaTest(value) {
  const { file } = value;
  if (
    !["image/jpeg", "image/png", "image/jpg", "video/mp4"].includes(
      file.mimetype
    )
  ) {
    throw new Error("Media must be jpeg, png, jpg, mp4");
  }
  return value;
}

function imageTest(value) {
  const { file } = value;
  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
    throw new Error("Media must be jpeg, png or jpg");
  }
  return value;
}

const passwordScalar = new GraphQLScalarType({
  name: "Password",
  description:
    "This type checks must be password(must be character, be string, be number)",
  serialize: passwordTest,
  parseValue: passwordTest,
});

const emailScalar = new GraphQLScalarType({
  name: "Email",
  description: "This is a string for representing email",
  serialize: emailTest,
  parseValue: emailTest,
});

const mediaScalar = new GraphQLScalarType({
  name: "Media",
  description: "This is a media for representing media",
  serialize: mediaTest,
  parseValue: mediaTest,
});

const imageScalar = new GraphQLScalarType({
  name: "Image",
  description: "This is a image for representing media",
  serialize: imageTest,
  parseValue: imageTest,
});

export default {
  Password: passwordScalar,
  Email: emailScalar,
  Media: mediaScalar,
  Image: imageScalar,
};
