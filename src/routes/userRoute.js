import express from "express";
import { createUserSchema, loginSchema, updateSchema  } from "../middleware/joiValidator.js";
import * as UserController from "../controller/userController.js"
import * as Middleware from "../middleware/auth.js"

const router = express.Router();

router.get("/test", function (req, res) {
  res.send({ status: true, message: "test-api working fine" });
});

router.post('/register', createUserSchema, Middleware.authentication, UserController.registerUser)

router.post('/login', loginSchema, UserController.loginUser)

router.put('/updateUser', updateSchema, Middleware.authentication, UserController.updateUser)

router.get('/inspectionManager',Middleware.authentication, UserController.getInspectionManager)

router.get('/logout', UserController.logoutUser)

export default router;
