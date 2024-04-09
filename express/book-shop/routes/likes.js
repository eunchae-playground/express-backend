import express from "express";
import connection from "../db.js";

const router = express.Router();
router.use(express.json());

router.post('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

export default router