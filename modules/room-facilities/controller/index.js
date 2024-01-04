const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const RoomFacilities = require("../Model");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");

const findAll = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginationService(page, size);

    const facilities = await RoomFacilities.find({})
      .populate("createdBy", "userName")
      .limit(limit)
      .skip(skip);

    const totalCount = await RoomFacilities.countDocuments();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { facilities, totalCount },
    });
  } catch (error) {
    logger.error("Error while fetching all room facilities ", error);
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
    const found = await RoomFacilities.findOne({ _id }).populate(
      "createdBy",
      "userName"
    );
    if (!found) {
      return next(
        new ErrorResponse(
          `there is no facility with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { facility: found },
    });
  } catch (error) {
    logger.error("Error while fetching facility details ", error);
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
    const { name } = req.body;
    const { _id: createdBy } = req.user;
    const found = await RoomFacilities.findOne({ name });
    if (found) {
      return next(
        new ErrorResponse(
          `facility name is already exists: ${name}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const newRoomFacility = new RoomFacilities({ createdBy, ...req.body });
    const facilityCreated = await newRoomFacility.save();
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Room Facility created successfully",
      data: { facility: facilityCreated },
    });
  } catch (error) {
    logger.error("Error while creating room facility ", error);
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
    const found = await RoomFacilities.findOne({ _id });
    if (!found) {
      return next(
        new ErrorResponse(
          `there is no facility with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    await RoomFacilities.updateOne({ _id }, { ...req.body });
    const updatedFacility = await RoomFacilities.findOne({ _id });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "facility updated successfully",
      data: { room: updatedFacility },
    });
  } catch (error) {
    logger.error("Error while updating facility ", error);
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
    const found = await RoomFacilities.findOne({ _id });
    if (!found) {
      return next(
        new ErrorResponse(
          `there is no facility with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const facility = await RoomFacilities.deleteOne({ _id });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { facility },
    });
  } catch (error) {
    logger.error("Error while deleting facility ", error);
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
};
