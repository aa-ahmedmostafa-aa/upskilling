const userController = require("../../controller/user.controller");
const validateRequest = require("../../../../common/middelware/validateRequest");
const isAuthorized = require("../../../../common/middelware/isAuthoraized");
const userValidation = require("../../joi/userValidation");
const userEndPoints = require("../../helpers/constants");
const router = require("express").Router();
const { upload } = require("../../../../common/middelware/uploadFile");
// const passport = require("passport");

router.get(
  "/:_id",
  isAuthorized(userEndPoints.endpoints.USER_GET_USER),
  userController.findOne
);
router.post(
  "/",
  upload.single("profileImage"),
  validateRequest(userValidation.signUpSchema),
  userController.signUp
);

router.post(
  "/login",
  validateRequest(userValidation.singInSchema),
  userController.login
);

router.post(
  "/change-password",
  isAuthorized(userEndPoints.endpoints.USER_CHANGE_PASSWORD),
  validateRequest(userValidation.userChangePasswordSchema),
  userController.changePassword
);
router.post(
  "/forgot-password",
  validateRequest(userValidation.userForgotPasswordSchema),
  userController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(userValidation.userPasswordResetSchema),
  userController.resetPassword
);

// router.post(
//   "/auth/google",
//   validateRequest(userValidation.socialLoginSchema),
//   (req, res, next) => {
//     passport.authenticate("google", { scope: ["profile"] };
//   }
// );

router.post(
  "/auth/google",
  validateRequest(userValidation.socialGoogleLoginSchema),
  userController.googleLoginHandler
);

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     // Send JWT to the client
//     res.json({ token: req.user });
//   }
// );

router.post(
  "/auth/facebook",
  validateRequest(userValidation.socialGoogleLoginSchema),
  userController.facebookLoginHandler
);

// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { session: false }),
//   (req, res) => {
//     // Send JWT to the client
//     res.json({ token: req.user });
//   }
// );

// router.get("/verify/:token", userController.verifyEmail);

// router.delete("/:id", userController.deleteUser);
// router.put("/:id", userController.updateUser);

module.exports = router;
