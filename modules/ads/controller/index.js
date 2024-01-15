const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const Room = require("../../rooms/Model");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");
const Ads = require("../Model");

const findAll = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginationService(page, size);

    const ads = await Ads.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy", "userName")
      .populate("room")
      .limit(limit)
      .skip(skip);

    const totalCount = await Ads.countDocuments();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { ads, totalCount },
    });
  } catch (error) {
    logger.error("Error while fetching all ads ", error);
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
    const found = await Ads.findOne({ _id })
      .populate("createdBy", "userName")
      .populate("room");

    if (!found) {
      return next(
        new ErrorResponse(
          `there is no ads with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { ads: found },
    });
  } catch (error) {
    logger.error("Error while fetching ads details ", error);
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
    const { room: roomId, discount, isActive } = req.body;
    const { _id: createdBy } = req.user;
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return next(
        new ErrorResponse(
          `there is no room with id : ${roomId}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const found = await Ads.findOne({ room: roomId });
    if (found) {
      return next(
        new ErrorResponse(
          `you have already ads with the same room : ${roomId}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const { price } = room;
    if (discount > price) {
      return next(
        new ErrorResponse(
          `sorry the discount :${discount} is greater than room price :${price}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    await Room.updateOne({ _id: roomId }, { discount });

    const newAds = new Ads({ createdBy, room: roomId, isActive });
    const adsCreated = await newAds.save();
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Ads created successfully",
      data: { ads: adsCreated },
    });
  } catch (error) {
    logger.error("Error while creating ads ", error);
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
    const { discount, isActive } = req.body;
    const found = await Ads.findOne({ _id });

    if (!found) {
      return next(
        new ErrorResponse(
          `there is no ads with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    await Room.updateOne({ _id: found.room }, { discount });

    await Ads.updateOne({ _id }, { isActive });
    const updatedAds = await Ads.findOne({ _id });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "ads updated successfully",
      data: { ads: updatedAds },
    });
  } catch (error) {
    logger.error("Error while updating ads ", error);
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
    const found = await Ads.findOne({ _id });
    if (!found) {
      return next(
        new ErrorResponse(
          `there is no ads with #_id: ${_id}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const ads = await Ads.deleteOne({ _id });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { ads },
    });
  } catch (error) {
    logger.error("Error while deleting ads ", error);
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
