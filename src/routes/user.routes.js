import { Router } from "express";
import {registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken,        
        updateAccountDetails,
        deleteAvatar} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js"
const router = Router()
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route('/register').post(
    upload.fields([
        {name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
        ]),
    registerUser)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refesh-token").post(refreshAccessToken)
router.route("/updateAccountDetails").post(updateAccountDetails)
router.route("/deleteProfile").post(verifyJWT,deleteAvatar)

export default router