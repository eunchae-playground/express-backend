// import
const express = require("express");

// app setting
const app = express();
app.listen(1234);
app.use(express.json());

// dummy data
let youtuber1 = {
  channelTitle: "김진짜",
  sub: "55만명",
  videoNum: "24개",
};
let youtuber2 = {
  channelTitle: "MBC",
  sub: "200만명",
  videoNum: "1400개",
};
let youtuber3 = {
  channelTitle: "아이유",
  sub: "1000만명",
  videoNum: "2100개",
};

// db initialization
let db = new Map();
let id = 1;
db.set(id++, youtuber1);
db.set(id++, youtuber2);
db.set(id++, youtuber3);

/* 
controller
*/
app.get("/youtubers", function (req, res) {
  res.json(Object.fromEntries(db));
});

app.get("/youtubers/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);

  const youtuber = db.get(id);
  if (youtuber == undefined) {
    res.json({
      message: "404 Not Found",
    });
  } else {
    res.json(youtuber);
  }
});

app.post("/youtubers", (req, res) => {
  db.set(id++, req.body);
  res.json({
    message: `${db.get(id - 1).channelTitle}님이 유튜버로 추가되었습니다.`,
  });
});

app.delete("/youtubers/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);

  const youtuber = db.get(id);
  if (youtuber) {
    db.delete(id);
    res.json({
      message: `${youtuber.channelTitle}님의 채널이 삭제되었습니다.`,
    });
  } else {
    res.json({ message: `${id}번의 채널이 존재하지 않습니다.` });
  }
});

app.delete("/youtubers", function (req, res) {
  let message;
  if (db.size >= 1) {
    db.clear();
    message = "전체 유튜버가 삭제되었습니다.";
  } else {
    message = "삭제할 유튜버가 없습니다.";
  }

  res.json({ message });
});

app.put("/youtubers/:id", function (req, res) {
  let { id } = req.params;
  id = parseInt(id);

  const youtuber = db.get(id);
  if (youtuber) {
    youtuber.channelTitle = req.body.channelTitle;
    db.set(id, youtuber);

    res.json({
      message: `채널명이 ${youtuber.channelTitle}로 변경되었습니다.`,
    });
  } else {
    res.json({ message: `${id}번의 채널이 존재하지 않습니다.` });
  }
});
