import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import {
  createTransaction,
  transactionHistory,
} from "../controllers/transaction.controller";

const router = Router();

router.post("/create", auth, createTransaction);
router.get("/history", auth, transactionHistory);

export default router;
