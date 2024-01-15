const User = require("../Model/user.model");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const { validatePassword, toAuthJSON } = require("../helpers/utils");
const jwt = require("jsonwebtoken");
const EmailService = require("../../../common/services/emailService");

const logger = require("../../../common/config/logger");
const { userTypes } = require("../helpers/constants");
const paginationService = require("../../../common/utils/paginationService");
const config = require("../../../common/config/configuration");
const { randomBytes } = require("crypto");
const ResetRequest = require("../Model/resetRequest.model");

const findAll = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginationService(page, size);

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select("-password")
      .limit(limit)
      .skip(skip);

    const totalCount = await User.countDocuments();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { users, totalCount },
    });
  } catch (error) {
    logger.error("Error while fetching all users ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const signUp = async (req, res, next) => {
  try {
    const { file, body } = req;
    const { email, userName, role } = body;

    // Define the search criteria
    const searchCriteria = {
      $or: [{ email }, { userName }],
    };

    const user = await User.findOne(searchCriteria);
    if (user) {
      return next(
        new ErrorResponse(
          "email or userName  is already exists",
          StatusCodes.BAD_REQUEST
        )
      );
    } else {
      let profileImage;
      if (file && file.path) {
        profileImage = file.path;
      } else {
        return next(
          new ErrorResponse(
            "profile image is required or not an image.",
            StatusCodes.BAD_REQUEST
          )
        );
      }

      const user = new User({ ...body, profileImage });
      const userCreated = await user.save();

      if (role == userTypes.USER) {
        //send email verification
      }

      // const token = jwt.sign({ _id: user._id }, "shhhhh", {});
      // let info = await transporter.sendMail({
      //   from: '"Node project 👻" <foo@example.com>', // sender address
      //   to: email, // list of receivers
      //   subject: "Hello ✔", // Subject line
      //   text: "Hello world?", // plain text body
      //   html: `<div style="color:red ; padding:100px; ">
      //     <h2>Email Varification </h2>
      //     <a href="http://localhost:5000/verify/${token}">Verifiy</a>
      //     </div>`, // html body
      // });
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User created successfully",
        data: { userCreated },
      });
    }
  } catch (error) {
    logger.error("Error while creating user ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }

  // try {
  //   await User.insertMany({ name, email, age, password });
  //   res.json({ message: "registed success" });
  // } catch ({ errors }) {
  //   res.json({ message: "error", ...errors });
  // }
};
const verifyEmail = async (req, res) => {
  if (req.params.token) {
    const decoded = jwt.verify(req.params.token, "shhhhh");
    try {
      const user = await User.findOne({ email: decoded.email });
      if (user) {
        if (user.verified == true) {
          res.json({ message: "verified" });
        } else {
          try {
            await User.updateOne({ email: decoded.email }, { verified: true });
            res.json({ message: "verified" });
          } catch (error) {
            res.json({ error });
          }
        }
      } else {
        res.json({ error: "email not found" });
      }
    } catch (error) {
      res.json({ error });
    }
  } else {
    res.json({ error: "error" });
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const found = await User.findOne({
      email,
    });

    if (!found) {
      return next(
        new ErrorResponse(
          "Login failed, No account with this e-mail",
          StatusCodes.NOT_FOUND
        )
      );
    }
    const isMatch = await validatePassword(password, found.password);
    if (!isMatch) {
      return next(
        new ErrorResponse(
          "Login Failed, please make sure password is correct!",
          StatusCodes.UNAUTHORIZED
        )
      );
    }
    const data = toAuthJSON(found);
    const user = await User.findOne({
      email,
    }).select("_id, userName , role"); // Exclude the password field
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged in successfully",
      data: { user, token: data.token },
    });
  } catch (error) {
    const errors = error.errors
      ? error.errors.map((e) => e.message)
      : error.message;
    logger.error("Error while login ", errors);
    next(
      new ErrorResponse(
        errors,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { user } = req;
  try {
    const userData = await User.findOne({ _id: user._id });
    const isMatch = await validatePassword(oldPassword, userData.password);

    if (!isMatch) {
      return next(
        new ErrorResponse(
          "please make sure old password is correct!",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 8);

    const updatedPayload = {
      password: newPasswordHashed,
    };

    await User.updateOne({ _id: user._id }, updatedPayload);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  } catch (error) {
    const errors = error.errors
      ? error.errors.map((e) => e.message)
      : error.message;
    logger.error("Error changing password", errors);
    next(
      new ErrorResponse(
        errors,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("Invalid Email Address");
    }

    const resetRequestFound = await ResetRequest.findOne({ userId: user._id });
    if (resetRequestFound) {
      return res.status(StatusCodes.CREATED).json({
        success: true,
        message:
          "Password reset request, already sent successfully ,check your email",
        data: null,
      });
    }

    const resetPasswordCode = randomBytes(2).toString("hex");
    const resetRequestPayload = {
      seed: resetPasswordCode,
      userId: user._id,
    };

    const resetPasswordRequest = new ResetRequest(resetRequestPayload);
    await resetPasswordRequest.save();

    await EmailService.sendPasswordResetEmail(
      resetPasswordCode,
      user.userName,
      user.email
    );
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Password reset token sent successfully",
      data: null,
    });
  } catch (error) {
    const errors = error.errors
      ? error.errors.map((e) => e.message)
      : error.message;
    logger.error("Error creating reset password token ", errors);
    next(
      new ErrorResponse(
        errors,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, password, seed } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("Invalid Email Address");
    }

    const resetRequest = await ResetRequest.findOne({ userId: user._id });

    if (!resetRequest) {
      return next(
        new ErrorResponse(
          "Cannot find any reset requests for you please try to reset again",
          StatusCodes.NOT_FOUND
        )
      );
    }
    if (seed !== resetRequest.seed) {
      return next(
        new ErrorResponse("Invalid verification code", StatusCodes.BAD_REQUEST)
      );
    }
    const salt = await bcrypt.genSalt(+config.salt);

    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedPayload = {
      password: hashedPassword,
    };

    await User.updateOne({ _id: user._id }, updatedPayload);
    await ResetRequest.deleteOne({ userId: user._id });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User Password Reset successfully",
      data: null,
    });
  } catch (error) {
    const errors = error.errors
      ? error.errors.map((e) => e.message)
      : error.message;
    logger.error("Error resetting user password ", errors);
    next(
      new ErrorResponse(
        errors,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const findOne = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const found = await User.findOne({ _id }).select("-password");
    if (!found) {
      return next(
        new ErrorResponse(
          `there is no user with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { user: found },
    });
  } catch (error) {
    logger.error("Error while fetching user details ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const deleteUser = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.deleteOne({ _id: id });
    res.json({ message: "deleted success", user });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const updateUser = async (req, res) => {
  let { id } = req.params;
  let { name } = req.body;
  try {
    const user = await User.updateOne({ _id: id }, { name: name });
    res.json({ message: "updated success", user });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

module.exports = {
  findAll,
  signUp,
  findOne,
  deleteUser,
  updateUser,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
