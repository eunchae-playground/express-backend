const express = require("express");
const app = express();
app.use(express.json());
app.listen(1234);

const db = new Map();
let id = 1;

app
  .route("/users/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const user = db.get(id);
    if (user) {
      res.status(200).json(user);
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

app.post("/join", (req, res) => {
  if (Object.keys(req.body).length !== 0) {
    db.set(id++, req.body);
    res
      .status(201)
      .json({ message: `${db.get(id - 1).name}님 회원가입 되었습니다.` });
  } else {
    res.status(400).json({ message: "입력값을 다시 확인해주세요" });
  }
});
