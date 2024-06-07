import { body } from "express-validator";
import validationErrorChecker from "./middlewares/validationErrorChecker.js";

const createEmailChain = () => {
  return body("email")
    .notEmpty()
    .withMessage("이메일을 입력해 주세요.")
    .bail()
    .isEmail()
    .withMessage("이메일 형식에 맞게 입력해 주세요.");
};

const createPasswordChain = () => {
  return body("password").notEmpty().withMessage("비밀번호를 입력해 주세요.");
};

export const getJoinValidator = () => {
  return [createEmailChain(), createPasswordChain(), validationErrorChecker];
};

export const getLoginValidator = () => {
  return [createEmailChain(), createPasswordChain(), validationErrorChecker];
};

export const getresetPasswordAuthenticateValidator = () => {
  return [createEmailChain(), validationErrorChecker];
};

export const getResetPasswordValidator = () => {
  return [createEmailChain(), createPasswordChain(), validationErrorChecker];
};
