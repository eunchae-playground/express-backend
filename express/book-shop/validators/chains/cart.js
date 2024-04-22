import { body, param } from "express-validator";

const getIdChain = () => {
  return param("id")
    .notEmpty()
    .withMessage("id값이 존재하지 않습니다.")
    .bail()
    .isNumeric()
    .withMessage("유효하지 않은 id값 입니다.");
};

const getIdsChain = () => {
  return body("ids")
    .notEmpty()
    .withMessage("ids값이 존재하지 않습니다.")
    .bail()
    .isArray()
    .withMessage("유효하지 않은 ids값 입니다.");
};

const getBookIdChain = () => {
  return body("bookId")
    .notEmpty()
    .withMessage("bookId값이 존재하지 않습니다.")
    .bail()
    .isNumeric()
    .withMessage("유효하지 않은 bookId값 입니다.");
};

const getAmountChain = () => {
  return body("amount")
    .notEmpty()
    .withMessage("수량을 입력해 주세요.")
    .bail()
    .isNumeric()
    .withMessage("유효하지 않은 수량값 입니다.");
};

export const getAddCartChains = () => {
  return [getBookIdChain(), getAmountChain()];
};

export const getDeleteCartsChains = () => {
  return [getIdsChain()];
};

export const getDeleteCartChains = () => {
  return [getIdChain()];
};
