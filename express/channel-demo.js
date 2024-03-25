const express = require("express");
const app = express();
app.use(express.json());
app.listen(1234);

let db = new Map();
let id = 1;

app
  .route("/channels")
  .get((req, res) => {
    res.status(200).json(Array.from(db.values()))
  })
  .post((req, res) => {
    if (req.body.title) {
      db.set(id++, req.body);
      res
        .status(201)
        .json({ message: `${req.body.title} 채널이 추가되었습니다.` });
    } else {
      res.status(400).json({ message: "요청값이 잘못되었습니다." });
    }
  });

app
  .route("/channels/:id")
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const channel = db.get(id);
    if (channel) {
      res.status(200).json(channel);
    } else {
      res.status(404).json({ message: "채널을 찾을 수 없습니다." });
    }
  })
  .put((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const { title } = req.body;

    const channel = db.get(id);
    if (channel) {
      db.set(id, { ...channel, title });
      res
        .status(200)
        .json({
          message: `${channel.title}에서 ${title}로 채널명이 수정되었습니다.`,
        });
    } else {
      res.status(404).json({ message: "채널을 찾을 수 없습니다." });
    }
  })
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    const channel = db.get(id);
    if (channel) {
      db.delete(id);
      res
        .status(200)
        .json({ message: `${channel.title}채널이 삭제되었습니다.` });
    } else {
      res.status(404).json({ message: "채널을 찾을 수 없습니다." });
    }
  });
