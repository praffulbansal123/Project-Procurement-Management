import express from "express";
import { createOrderSchema  } from "../middleware/joiValidator.js";
import * as OrderController from "../controller/orderController.js"
import * as Middleware from "../middleware/auth.js"

const router = express.Router();

// create order
router.post('/create', createOrderSchema, Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager']), OrderController.createOrderHandler)

// link blankChecklist
router.put('/link/checklist/:orderId/:checklistId', Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager']), OrderController.linkBlankChecklistHandler)

// list of orders
router.get('/get', Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager', 'inspection manager']), OrderController.getOrdersHandler)

export default router