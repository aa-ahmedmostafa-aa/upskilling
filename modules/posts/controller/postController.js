const Comment = require("../../Comments/Model/Comment");
const Post = require("../Model/postModel");
const redis = require("redis");
const client = redis.createClient(6379);
const getAllPosts = async (req, res) => {
  // const blogs = await Blog.aggregate([
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "createdBy",
  //       foreignField: "_id",
  //       as:"users_blogs"
  //     },
  //   },
  // ]);
  let { page, size } = req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }
  let limit = parseInt(size);
  const skip = (page - 1) * size;

  // const posts = await Post.find({})
  //   .populate("createdBy")
  //   .populate({
  //     path: "comments",
  //     populate: {
  //       path: "createdBy",
  //       model: "user",
  //     },
  //   })
  //   .limit(limit)
  //   .skip(skip);
  // const all = await Post.countDocuments();
  // const totalPage = Math.ceil(all / limit);
  // res.json({ message: "All posts", page, totalPage, size, data: posts });
  const resultArr = [];
  const cursor = Post.find({}).populate("createdBy").cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const comments = await Comment.find({ postId: doc._id }).populate(
      "createdBy"
    );
    const obj = { ...doc._doc, comments };
    resultArr.push(obj);
    // console.log(doc);
  }
  client.setex("posts", 5, JSON.stringify(resultArr));
  res.json({ message: "All posts", data: resultArr });
};

const add_post = async (req, res) => {
  console.log(req.file);
  const { title, content, createdBy } = req.body;
  const newPost = new Post({
    title,
    content,
    createdBy,
    postImage: `${process.env.BASE_URL_LOCAL}${req.file.path}`,
  });
  await newPost.save();
  res.json({ message: "Post created success" });
};

module.exports = {
  getAllPosts,
  add_post,
};
