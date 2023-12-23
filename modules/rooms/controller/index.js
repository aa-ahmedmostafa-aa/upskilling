const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const User = require("../../users/Model/user.model");
const Room = require("../Model");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");

const getAll = async (req, res, next) => {
  try {
    const { page, limit: size } = req.query;
    const { limit, skip } = paginationService(page, size);

    const rooms = await Room.find({})
      .populate("createdBy", "userName")
      .limit(limit)
      .skip(skip);

    const totalCount = await Room.countDocuments();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "success",
      data: { rooms, totalCount },
    });
  } catch (error) {
    logger.error("Error while fetching all rooms ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const create = async (req, res, next) => {
  try {
    const { createdBy } = req.body;
    const user = await User.find({ _id: createdBy });
    if (!user) {
      return next(
        new ErrorResponse(
          `there is no user with #_id: ${createdBy}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const images = req.files.map((img) => img.path);
    const newRoom = new Room({ ...req.body, images });
    const roomCreated = await newRoom.save();
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Room created successfully",
      data: { room: roomCreated },
    });
  } catch (error) {
    logger.error("Error while creating room ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = {
  getAll,
  create,
};
