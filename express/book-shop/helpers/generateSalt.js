import crypto from "crypto";

const generateSalt = () => {
  return crypto.randomBytes(32).toString("base64");
};

export default generateSalt;
