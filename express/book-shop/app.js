/*
김은채
*/

import "dotenv/config";
import express from "express";
import usersRouter from "./routes/users.js";
import booksRouter from "./routes/books.js";
import cartsRouter from "./routes/carts.js";
import ordersRouter from "./routes/orders.js";
import likesRouter from "./routes/likes.js";

const app = express();
app.use(express.json());
app.listen(1234);

app.use("/", usersRouter);
app.use("/books", booksRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
app.use("/likes", likesRouter);
