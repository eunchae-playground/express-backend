import express from "express";
import connection from "../db.js";

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

export default router