const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");
const Room = require("../../rooms/Model");
const RoomReview = require("../Model");

const findAll = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { roomId } = req.params;
    const { limit, skip } = paginationService(page, size);

    const room = await Room.findById(roomId);

    if (!room) {
      return next(
        new ErrorResponse(
          `Room not found with id: ${roomId}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    const roomReviews = await RoomReview.find({ room: roomId })
      .sort({ createdAt: -1 })
      .populate("user", "userName , profileImage")
      .populate("room", "roomNumber")
      .limit(limit)
      .skip(skip);

    const totalCount = await RoomReview.countDocuments({ room: roomId });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { roomReviews, totalCount },
    });
  } catch (error) {
    logger.error("Error while fetching room reviews ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const createReview = async (req, res, next) => {
  const { roomId, rating, review } = req.body;
  const { _id: userId } = req.user;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return next(
        new ErrorResponse(
          `Room not found with id: ${roomId}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Check if the user has already added a review for the same room
    const existingReview = await RoomReview.findOne({
      room: roomId,
      user: userId,
    });

    if (existingReview) {
      return next(
        new ErrorResponse(
          `User has already added a review for this room`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const roomReview = await RoomReview.create({
      room: roomId,
      user: userId,
      rating,
      review,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Review created successfully",
      data: { roomReview },
    });
  } catch (error) {
    logger.error("Error while creating review", error);
    next(
      new ErrorResponse(
        error.message,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = {
  findAll,
  createReview,
};
