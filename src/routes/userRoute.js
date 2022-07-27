import express from "express";
import { createUserSchema, loginSchema } from "../middleware/joiValidator.js";
import * as UserController from "../controller/userController.js"

const router = express.Router();

router.get("/test", function (req, res) {
  res.send({ status: true, message: "test-api working fine" });
});

router.post('/register', createUserSchema, UserController.registerUser )

router.post('/login', loginSchema, UserController.loginUser)

export default router;
