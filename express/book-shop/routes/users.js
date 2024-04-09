import express from "express";
import jwt from "jsonwebtoken";
import connection from "../db.js";

const router = express.Router();
router.use(express.json());

router.post('/join', (req, res) => {

});

router.post('/login', (req, res) => {

});

router.post('/users/reset', (req, res) => {

});

router.put('/users/reset', (req, res) => {

});

export default router