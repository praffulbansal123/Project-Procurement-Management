import express from "express";
import { createBlankChecklistSchema  } from "../middleware/joiValidator.js";
import * as BlankChecklistController from "../controller/blankChecklistController.js"
import * as Middleware from "../middleware/auth.js"

const router = express.Router();


router.post('/register/blank', createBlankChecklistSchema, Middleware.authentication,Middleware.allowedRoles(['admin','procurement manager']), BlankChecklistController.registerBlankChecklist)

router.get('/blank/checklist/:clientId', Middleware.authentication,Middleware.allowedRoles(['admin','procurement manager']), BlankChecklistController.getChecklistByClientIdHandler)

export default router