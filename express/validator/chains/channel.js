import { body } from "express-validator";

const validateNameChain = () => {
  return body("name").notEmpty().withMessage("채널명을 입력해 주세요.");
};

const validateSubNameChain = () => {
  return body("subName")
    .notEmpty()
    .withMessage("서브 채널명을 입력해 주세요.")
    .bail()
    .isInt()
    .withMessage("서브 채널명은 숫자여야 합니다.");
};

export const getCreateChannelChains = () => {
  return [validateNameChain(), validateSubNameChain()];
};

export const getUpdateChannelChains = () => {
  return [validateNameChain()];
};
