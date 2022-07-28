import express, { Router } from "express";
import { createUserSchema, loginSchema } from "../middleware/joiValidator.js";
import * as UserController from "../controller/userController.js"
import * as Middleware from "../middleware/auth.js"

const router = express.Router();

router.get("/test", function (req, res) {
  res.send({ status: true, message: "test-api working fine" });
});

router.post('/register', createUserSchema, Middleware.authentication, UserController.registerUser)

router.post('/login', loginSchema, UserController.loginUser)

router.get('/logout', UserController.logoutUser)

export default router;
