const isAuthoraized = require("../../../common/middelware/isAuthoraized");
const validateRequest = require("../../../common/middelware/validateRequest");

const router = require("express").Router();

const multer = require("multer");
const { addPostSchema } = require("../joi/postValidation");
const { getAllPosts, add_post } = require("../controller/postController");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const uploads = multer({ storage });
const redis = require("redis");
const client = redis.createClient(6379);
// const cash = (key) =>{
//   return (req,res,next)=>{
//     client.get(key, (err, data) => {
//       if (err) throw err;
//       if (data != null) {
//         res.json({ message: "success from cash", data: JSON.parse(data) });
//       } else {
//         next();
//       }
//     });
//   }
// }
const postCash = (req, res, next) => {
  client.get("posts", (err, data) => {
    if (err) throw err;
    if (data != null) {
      res.json({ message: "success from cash", data: JSON.parse(data) });
    } else {
      next();
    }
  });
};
router.get("/posts", postCash, getAllPosts);
router.post(
  "/addPost",
  // isAuthoraized(ADD_BLOG),
  uploads.single("postImage"),
  validateRequest(addPostSchema),
  add_post
);

module.exports = router;
