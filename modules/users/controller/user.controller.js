const User = require("../Model/user.model");
const bcrypt = require("bcrypt");
const { StatusCodes, BAD_REQUEST } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const { OAuth2Client } = require("google-auth-library");
const nanoid = require("../../../common/config/nanoId");
const client = new OAuth2Client(
  "628230144726-m8ftqlck1dqg9dduufvg8l099e5iihn9.apps.googleusercontent.com"
);

let transporter = nodemailer.createTransport({
  service: "gmail", // true for 465, false for other ports
  auth: {
    user: "routeacademycairo3@gmail.com", // generated ethereal user
    pass: "Routeegypt20110100", // generated ethereal password
  },
});

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json({ message: "All users", data: users });
};

const signUp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return next(
        new ErrorResponse("email is already exists", StatusCodes.BAD_REQUEST)
      );
    } else {
      const user = new User(req.body);
      await user.save();
      // const token = jwt.sign({ email }, "shhhhh", {
      //   expiresIn: "1h",
      // });
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
        data: { user },
      });
    }
  } catch (errors) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "error", ...errors });
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
            const updatedUser = await User.updateOne(
              { email: decoded.email },
              { verified: true }
            );
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
const sign_in = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "email is not found" });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ _id: user._id, role: user.role }, "shhhhh", {
          expiresIn: "1h",
        });
        // var decoded = jwt.verify(token, 'shhhhh');

        res.status(StatusCodes.OK).json({
          message: "success",
          token,
          data: {
            _id: user._id,
            email: user.email,
            role: user.role,
          },
        });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "incorrect password" });
      }
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
};
const googleLogin = async (req, res) => {
  const { tokenId, googleId } = req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "628230144726-m8ftqlck1dqg9dduufvg8l099e5iihn9.apps.googleusercontent.com",
    })
    .then(async (result) => {
      const { payload } = result;
      if (payload.email_verified) {
        const user = await User.findOne({ googleId });
        if (user) {
          const token = jwt.sign({ _id: user._id, role: user.role }, "shhhhh", {
            expiresIn: "1h",
          });
          res.status(StatusCodes.OK).json({
            message: "success",
            token,
            data: {
              _id: user._id,
              email: user.email,
              role: user.role,
            },
          });
        } else {
          const newUser = new User({
            name: payload.name,
            email: payload.email,
            role: "user",
            googleId,
            verified: true,
            password: nanoid(),
          });
          const savedUser = await newUser.save();
          const token = jwt.sign(
            { _id: savedUser._id, role: savedUser.role },
            "shhhhh",
            {
              expiresIn: "1h",
            }
          );
          res.status(StatusCodes.OK).json({
            message: "success",
            token,
            data: {
              _id: savedUser._id,
              email: savedUser.email,
              role: savedUser.role,
            },
          });
        }
      } else {
        res.json({ message: "email not verified" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
const getUser = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    res.json({ message: "success", user });
  } catch (error) {
    res.json({ message: "error", error });
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
  getAllUsers,
  signUp,
  getUser,
  deleteUser,
  updateUser,
  sign_in,
  verifyEmail,
  googleLogin,
};
