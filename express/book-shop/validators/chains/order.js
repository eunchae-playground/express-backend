import { body } from "express-validator";

const getDeliveryInfoAddressChain = () => {
  return body("deliveryInfo.*.address")
    .notEmpty()
    .withMessage("주소를 입력해 주세요.");
};

const getDeliveryInfoDetailAddressChain = () => {
  return body("deliveryInfo.*.detailAddress")
    .notEmpty()
    .withMessage("상세 주소를 입력해 주세요.");
};

const getDeliveryInfoReceiverChain = () => {
  return body("deliveryInfo.*.receiver")
    .notEmpty()
    .withMessage("수령인을 입력해 주세요.");
};

const getDeliveryInfoContactChain = () => {
  return body("deliveryInfo.*.contact")
    .notEmpty()
    .withMessage("전화번호를 입력해 주세요.");
};

const getOrderBooksChain = () => {
  return body("orderBooks")
    .notEmpty()
    .withMessage("주문 상품이 존재하지 않습니다.");
};

export const getCreateOrderChains = () => {
  return [
    getDeliveryInfoAddressChain(),
    getDeliveryInfoDetailAddressChain(),
    getDeliveryInfoReceiverChain(),
    getDeliveryInfoContactChain(),
    getOrderBooksChain(),
  ];
};
