import express from "express";
import {
    createLead,
    updateLead,
    deleteLead,
    getsingleLead,
    getallLeads
} from "../controllers/lead.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.use(verifyJWT);

router.post("/leads", createLead);
router.get("/leads", getallLeads);
router.get("/leads/singlelead/:id", getsingleLead);
router.put("/leads/updateLead/:id", updateLead);
router.delete("/leads/deleteLead/:id", deleteLead);

export default router;