const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const User = require("../../users/Model/user.model");
const Room = require("../Model");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");
const Booking = require("../../booking/Model");

const findAll = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginationService(page, size);

    const rooms = await Room.find({})
      .populate("createdBy", "userName")
      .limit(limit)
      .skip(skip);

    const totalCount = await Room.countDocuments();

    res.status(StatusCodes.OK).json({
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

const findAllAvailableRooms = async (req, res, next) => {
  try {
    const { page, size, startDate, endDate } = req.query;
    const { limit, skip } = paginationService(page, size);

    let query = {};
    // Validate startDate and endDate
    if (startDate && endDate) {
      (query.startDate = { $lte: new Date(endDate) }),
        (query.endDate = { $gte: new Date(startDate) });
    }

    // Find all bookings in the date range
    const bookedRooms = await Booking.find(query).select("room");

    const bookedRoomIds = bookedRooms.map((booking) => booking.room);

    // Find all rooms that are not in the bookedRoomIds
    const rooms = await Room.find({
      _id: { $nin: bookedRoomIds },
    })
      .populate("createdBy", "userName")
      .limit(limit)
      .skip(skip);

    const totalCount = await Room.countDocuments({
      _id: { $nin: bookedRoomIds },
    });

    res.status(StatusCodes.OK).json({
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

const findOne = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const found = await Room.findOne({ _id }).populate("createdBy", "userName");
    if (!found) {
      return next(
        new ErrorResponse(
          `there is no room with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { room: found },
    });
  } catch (error) {
    logger.error("Error while fetching room details ", error);
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
    const { createdBy, roomNumber } = req.body;

    const found = await Room.findOne({ roomNumber });
    if (found) {
      return next(
        new ErrorResponse(
          `room number already exists: ${roomNumber}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

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
  findAllAvailableRooms,
};
