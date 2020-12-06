const user = require("../models/user");

module.exports.validateRegisterInput = (
  username,
  password,
  confirmPassword,
  email
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!email.match(regEx)) {
      errors.email = " Please use a valid email";
    }
  }
  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.password = "Password must match";
  }

  return {
    errors,
    // "valid" is an object to tell if theres any errors
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  return {
    errors,
    // "valid" is an object to tell if theres any errors
    valid: Object.keys(errors).length < 1,
  };
};
