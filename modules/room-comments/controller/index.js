const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");
const Room = require("../../rooms/Model");
const RoomComment = require("../Model");

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

    const roomComments = await RoomComment.find({ room: roomId })
      .sort({ createdAt: -1 })
      .populate("user", "userName , profileImage")
      .populate("room", "roomNumber")
      .limit(limit)
      .skip(skip);

    const totalCount = await RoomComment.countDocuments({ room: roomId });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { roomComments, totalCount },
    });
  } catch (error) {
    logger.error("Error while fetching room comments ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const createComment = async (req, res, next) => {
  const { roomId, comment } = req.body;
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

    const roomComment = await RoomComment.create({
      room: roomId,
      user: userId,
      comment,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Comment created successfully",
      data: { roomComment },
    });
  } catch (error) {
    logger.error("Error while creating comment", error);
    next(
      new ErrorResponse(
        error.message,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const updateComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { comment: newComment } = req.body;
  const { _id: userId } = req.user;

  try {
    // Find the comment by id
    let comment = await RoomComment.findById(commentId);

    if (!comment) {
      return next(
        new ErrorResponse(
          `Comment not found with id: ${commentId}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Check if the user is the author of the comment
    if (comment.user.toString() !== userId) {
      return next(
        new ErrorResponse(
          `User is not authorized to update this comment`,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // Update the comment
    comment = await RoomComment.findByIdAndUpdate(
      commentId,
      { comment: newComment },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Comment updated successfully",
      data: { comment },
    });
  } catch (error) {
    logger.error("Error while updating comment", error);
    next(
      new ErrorResponse(
        error.message,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const deleteComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { _id: userId } = req.user;

  try {
    // Find the comment by id
    const comment = await RoomComment.findById(commentId);

    if (!comment) {
      return next(
        new ErrorResponse(
          `Comment not found with id: ${commentId}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Check if the user is the author of the comment
    if (comment.user.toString() !== userId) {
      return next(
        new ErrorResponse(
          `User is not authorized to delete this comment`,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // Delete the comment
    await RoomComment.findByIdAndDelete(commentId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    logger.error("Error while deleting comment", error);
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
  createComment,
  deleteComment,
  updateComment,
};
