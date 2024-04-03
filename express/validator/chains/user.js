import { body } from "express-validator";

const getEmailChain = () => {
  return body("email")
    .notEmpty()
    .withMessage("이메일을 입력해 주세요.")
    .bail()
    .isEmail()
    .withMessage("이메일 형식에 맞게 입력해 주세요.");
};

const getNameChain = () => {
  return body("name").notEmpty().withMessage("이름을 입력해 주세요.");
};

const getPasswordChain = () => {
  return body("password").notEmpty().withMessage("비밀번호를 입력해 주세요.");
};

const getContactChain = () => {
  return body("contact").notEmpty().withMessage("연락처를 입력해 주세요.");
};

export const getJoinChains = () => {
  return [
    getEmailChain(),
    getNameChain(),
    getPasswordChain(),
    getContactChain(),
  ];
};

export const getLoginChains = () => {
  return [getEmailChain(), getPasswordChain()];
};
