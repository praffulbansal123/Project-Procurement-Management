import express from "express";
import { createUserSchema, loginSchema, updateSchema  } from "../middleware/joiValidator.js";
import * as UserController from "../controller/userController.js"
import * as Middleware from "../middleware/auth.js"

const router = express.Router();

// Testing Route
router.get("/test", function (req, res) {
  res.send({ status: true, message: "test-api working fine" });
});

// Register user route
router.post('/register', createUserSchema, Middleware.authentication, UserController.registerUser)

// Login user route
router.post('/login', loginSchema, UserController.loginUser)

// Update inspectionManager workingUnder route
router.put('/updateUser', updateSchema, Middleware.authentication, Middleware.allowedRoles(['admin']), UserController.updateUserHandler)

// Get inspectionManager route
router.get('/inspectionManager',Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager']), UserController.getInspectionManagerHandler)

// Get users
router.get('/get', Middleware.authentication, Middleware.allowedRoles(['admin']), UserController.getUserByRoleHandler);

// User Logout route
router.get('/logout', UserController.logoutUser)

export default router;
