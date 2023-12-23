const userController = require("../controller/user.controller");
const validateRequest = require("../../../common/middelware/validateRequest");
const isAuthorized = require("../../../common/middelware/isAuthoraized");
const userValidation = require("../joi/userValidation");
const router = require("express").Router();

router.get("/", isAuthorized(), userController.getAllUsers);
router.get("/verify/:token", userController.verifyEmail);
router.get("/:id", userController.getUser);
router.post("/", validateRequest(userValidation.signUpSchema), userController.signUp);
router.post("/googleLogin", userController.googleLogin);

router.post("/signIn", validateRequest(userValidation.singInSchema), userController.sign_in);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);

module.exports = router;
