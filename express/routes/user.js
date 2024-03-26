const express = require("express");
const router = express.Router();
router.use(express.json());

const db = new Map();
let id = 1;
db.set(id++, { name: "userA" });
db.set(id++, { name: "userB" });
db.set(id++, { name: "userC" });

router
  .route("/users/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const user = db.get(id);
    if (user) {
      res.status(200).json({ name: user.name });
    } else {
      res.status(404).json({ message: "회원 정보가 없습니다." });
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const user = db.get(id);
    if (user) {
      db.delete(id);
      res.status(200).json({ message: `${user.name}님 삭제되었습니다.` });
    } else {
      res.status(404).json({ message: "회원 정보가 없습니다." });
    }
  });

router.post("/join", (req, res) => {
  if (Object.keys(req.body).length !== 0) {
    db.set(id++, req.body);
    res
      .status(201)
      .json({ message: `${db.get(id - 1).name}님 회원가입 되었습니다.` });
  } else {
    res.status(400).json({ message: "입력값을 다시 확인해주세요" });
  }
});

router.post("/login", (req, res) => {
  const { name, password } = req.body;
  let loginUser = {};
  db.forEach((user) => {
    if (user.name === name) {
      loginUser = user;
    }
  });

  if (Object.keys(loginUser).length < 1) {
    res.status(404).json({ message: "존재하지 않는 유저입니다." });
  }

  if (loginUser.password !== password) {
    res.status(401).json({ message: "비밀번호가 틀렸습니다." });
  }

  res.status(200).json({ message: `${loginUser.name}님 로그인 되었습니다.` });
});

module.exports = router;
