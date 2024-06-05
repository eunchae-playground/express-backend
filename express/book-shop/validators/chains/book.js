import { param } from "express-validator";

const getBookIdParamChain = () => {
  return param("id").isNumeric().withMessage("잘못된 id값입니다.");
};

export const getBookDetailChains = () => {
  return [getBookIdParamChain()];
};
