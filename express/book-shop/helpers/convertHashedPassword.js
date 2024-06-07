import crypto from "crypto";

const convertHashedPassword = (password, salt) => {
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("base64");

  return hashedPassword;
};

export default convertHashedPassword;
