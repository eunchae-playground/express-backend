import { body } from "express-validator";

const getEmailChain = () => {
  return body("email")
    .notEmpty()
    .withMessage("이메일을 입력해 주세요.")
    .bail()
    .isEmail()
    .withMessage("이메일 형식에 맞게 입력해 주세요.");
};

const getPasswordChain = () => {
  return body("password").notEmpty().withMessage("비밀번호를 입력해 주세요.");
};

export const getJoinChains = () => {
  return [getEmailChain(), getPasswordChain()];
};

export const getLoginChains = () => {
  return [getEmailChain(), getPasswordChain()];
};

export const getresetPasswordAuthenticateChains = () => {
  return [getEmailChain()];
};

export const getResetPasswordChains = () => {
  return [getEmailChain(), getPasswordChain()];
};
