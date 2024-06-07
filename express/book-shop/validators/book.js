import { param } from "express-validator";
import validationErrorChecker from "./middlewares/validationErrorChecker.js";

const createBookIdParamChain = () => {
  return param("id").isNumeric().withMessage("잘못된 id값입니다.");
};

export const getBookDetailValidator = () => {
  return [createBookIdParamChain(), validationErrorChecker];
};
