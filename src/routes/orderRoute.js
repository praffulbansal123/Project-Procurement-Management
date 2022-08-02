import express from "express";
import { createOrderSchema, updateOrderStatusSchema } from "../middleware/joiValidator.js";
import * as OrderController from "../controller/orderController.js"
import * as Middleware from "../middleware/auth.js"

const router = express.Router();

// create order
router.post('/create', createOrderSchema, Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager']), OrderController.createOrderHandler)

// link blankChecklist
router.put('/link/checklist/:orderId/:checklistId', Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager']), OrderController.linkBlankChecklistHandler)

// list of orders
router.get('/get', Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager', 'inspection manager']), OrderController.getOrdersHandler)

// verify order
router.patch('/verify/:orderId', Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager']),  OrderController.orderVerificationHandler)

// update order status
router.patch('/update/:orderId', updateOrderStatusSchema, Middleware.authentication, Middleware.allowedRoles(['admin','procurement manager']), OrderController.updateStatusHandler)

// get order status 
router.get('/get/:clientId', Middleware.authentication, Middleware.allowedRoles(['client']), OrderController.getOrderStatusHandler)

export default router