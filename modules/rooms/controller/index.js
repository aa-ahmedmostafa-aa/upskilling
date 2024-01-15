const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const Room = require("../Model");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");
const {
  findAvailableRooms,
  findAllRoomsWithReservedFlag,
} = require("../helpers/utils");
const RoomFacilities = require("../../room-facilities/Model");
const { cloudinary } = require("../../../common/utils/cloudinary");
const Ads = require("../../ads/Model");
const Booking = require("../../booking/Model");

const findAll = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginationService(page, size);

    const rooms = await Room.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy", "userName")
      .populate("facilities", "name")
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
    const { page, size, startDate, endDate, capacity } = req.query;
    let rooms, totalCount;

    if (startDate && endDate) {
      // If startDate and endDate are provided, find available rooms
      const data = await findAvailableRooms(
        page,
        size,
        startDate,
        endDate,
        capacity
      );
      rooms = data.rooms;
      totalCount = data.totalCount;
    } else {
      // If no specific date range is provided, get all rooms and flag as reserved if booked
      const data = await findAllRoomsWithReservedFlag(page, size);
      rooms = data.roomsWithBookingFlag;
      totalCount = data.totalCount;
    }

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
    const found = await Room.findOne({ _id })
      .populate("facilities", "name")
      .populate("createdBy", "userName");
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
    const { roomNumber, facilities } = req.body;
    const { _id: createdBy } = req.user;

    const found = await Room.findOne({ roomNumber });
    if (found) {
      return next(
        new ErrorResponse(
          `room number already exists: ${roomNumber}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Count how many of these IDs exist in the collection
    const count = await RoomFacilities.countDocuments({
      _id: { $in: facilities },
    });

    // Check if the count matches the number of IDs
    if (count != facilities.length) {
      return next(
        new ErrorResponse(
          `facility rooms ids not found: ${facilities}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const files = req.files;
    const uploadPromises = files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "rooms", // Optional: specify a folder in Cloudinary
      });
    });

    const result = await Promise.all(uploadPromises);
    const images = result.map((img) => img.url);
    const newRoom = new Room({ ...req.body, createdBy, images });
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
  const { _id } = req.params;

  try {
    // Use findById instead of findOne for better performance when searching by ID
    const room = await Room.findById(_id);

    if (!room) {
      return next(
        new ErrorResponse(
          `Room not found with id: ${_id}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    const files = req.files;
    const uploadPromises = files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "rooms", // Optional: specify a folder in Cloudinary
      });
    });

    const result = await Promise.all(uploadPromises);
    const images = result.map((img) => img.url);

    // Use findByIdAndUpdate for atomic operations and better performance
    const updatedRoom = await Room.findByIdAndUpdate(
      _id,
      { ...req.body, images },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Room updated successfully",
      data: { room: updatedRoom },
    });
  } catch (error) {
    logger.error("Error while updating room", error);
    next(
      new ErrorResponse(
        error.message,
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

    const result = await Promise.all([
      Room.deleteOne({ _id }),
      Ads.deleteMany({ room: _id }),
      Booking.deleteMany({ room: _id }),
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { room: result[0] },
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
