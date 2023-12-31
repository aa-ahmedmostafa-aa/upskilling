const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const User = require("../../users/Model/user.model");
const Room = require("../Model");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");
const Booking = require("../Model");

const findAllMyBooking = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginationService(page, size);
    const { _id: userId } = req.user;
    const myBooking = await Booking.find({ user: userId })
      .populate("user", "room")
      .limit(limit)
      .skip(skip);

    const totalCount = await Booking.countDocuments();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { myBooking, totalCount },
    });
  } catch (error) {
    logger.error("Error while fetching my booking ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const findAll = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginationService(page, size);

    const booking = await Booking.find({})
      .populate("user", "userName")
      .populate("room", "roomNumber")
      .limit(limit)
      .skip(skip);

    const totalCount = await Booking.countDocuments();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { booking, totalCount },
    });
  } catch (error) {
    logger.error("Error while fetching all booking ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const findOne = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const found = await Booking.findOne({ _id })
      .populate("user", "userName")
      .populate("room", "roomNumber");
    if (!found) {
      return next(
        new ErrorResponse(
          `there is no booking with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { booking: found },
    });
  } catch (error) {
    logger.error("Error while fetching booking details ", error);
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
    const { startDate, endDate, room: roomId, totalPrice } = req.body;

    const { _id: userId } = req.user;
    const room = await Room.find({ _id: roomId });
    if (!room) {
      return next(
        new ErrorResponse(
          `there is no room with _id: ${roomId}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const user = await User.find({ _id: userId });
    if (!user) {
      return next(
        new ErrorResponse(
          `there is no user with #_id: ${userId}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const newBooking = new Booking({
      startDate,
      endDate,
      room: roomId,
      user: userId,
      totalPrice,
    });

    const bookingCreated = await newBooking.save();
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Room created successfully",
      data: { booking: bookingCreated },
    });
  } catch (error) {
    logger.error("Error while creating booking ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const updateOne = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const found = await Room.findOne({ _id });
    if (!found) {
      return next(
        new ErrorResponse(
          `there is no room with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const images = req.files.map((img) => img.path);

    await Room.updateOne({ _id }, { ...req.body, images });
    const updatedRoom = await Room.findOne({ _id });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Room updated successfully",
      data: { room: updatedRoom },
    });
  } catch (error) {
    logger.error("Error while updating room ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const found = await Room.findOne({ _id });
    if (!found) {
      return next(
        new ErrorResponse(
          `there is no room with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const room = await Room.deleteOne({ _id });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { room },
    });
  } catch (error) {
    logger.error("Error while deleting room ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = {
  findAll,
  findOne,
  create,
  deleteOne,
  updateOne,
  findAllMyBooking,
};
