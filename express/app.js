import "dotenv/config";
import express from "express";
import channelRouter from "./routes/channel.js";
import userRouter from "./routes/user.js";

const app = express();
app.use(express.json());
app.listen(1234);

app.use("/", userRouter);
app.use("/channels", channelRouter);
