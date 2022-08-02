import express from "express";
import { createBlankChecklistSchema  } from "../middleware/joiValidator.js";
import { createFilledChecklistSchema  } from "../middleware/joiValidator.js";
import * as BlankChecklistController from "../controller/blankChecklistController.js"
import * as FilledChecklistController from "../controller/filledChecklistController.js"
import * as Middleware from "../middleware/auth.js"

const router = express.Router();

// Create  blank checklist
router.post('/register/blank', createBlankChecklistSchema, Middleware.authentication,Middleware.allowedRoles(['admin','procurement manager']), BlankChecklistController.registerBlankChecklist)

// Get blank checklist by clientId
router.get('/blank/checklist/:clientId', Middleware.authentication,Middleware.allowedRoles(['admin','procurement manager']), BlankChecklistController.getChecklistByClientIdHandler)

// create filled checklist
router.post('/register/fill/:orderId',createFilledChecklistSchema, Middleware.authentication,Middleware.allowedRoles(['inspection manager']), FilledChecklistController.fillChecklistHandler)

export default router