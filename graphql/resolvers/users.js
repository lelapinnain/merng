const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("errors", {
          errors,
        });
      }
      //
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User Not Found", { errors });
      }
      //
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Incorrect Password";
        throw new UserInputError("Wrong Credentials", { errors });
      }
      const token = generateToken(user);

      return { ...user._doc, id: user.id, token };
    },
    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } },
      context,
      info
    ) {
      // validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      );
      if (!valid) {
        throw new UserInputError("errors", {
          errors,
        });
      }
      // TODO: make sure user doesnt exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("user already exists", {
          errors: {
            username: "this username already exists",
          },
        });
      }

      // hash password and create auth token
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return { ...res._doc, id: res.id, token };
    },
  },
};
