import express from "express";
import { createOrderSchema  } from "../middleware/joiValidator.js";
import * as OrderController from "../controller/orderController.js"
import * as Middleware from "../middleware/auth.js"

const router = express.Router();


router.post('/create', createOrderSchema, Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager']), OrderController.createOrderHandler)

export default router