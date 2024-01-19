const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const Room = require("../../rooms/Model");
const logger = require("../../../common/config/logger");
const User = require("../../users/Model/user.model");
const Booking = require("../../booking/Model");
const { userTypes } = require("../../users/helpers/constants");
const Ads = require("../../ads/Model");
const RoomFacilities = require("../../room-facilities/Model");

const chart = async (req, res, next) => {
  try {
    const roomsCount = await Room.countDocuments();
    const facilitiesCount = await RoomFacilities.countDocuments();

    const adsCount = await Ads.countDocuments();
    const usersCount = await User.countDocuments({ role: userTypes.USER });
    const adminsCount = await User.countDocuments({ role: userTypes.ADMIN }); // assuming 'role' field exists in User model
    const pendingBookingsCount = await Booking.countDocuments({
      status: "pending",
    }); // assuming 'status' field exists in Booking model
    const completedBookingsCount = await Booking.countDocuments({
      status: "completed",
    }); // assuming 'status' field exists in Booking model

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: {
        rooms: roomsCount,
        facilities: facilitiesCount,
        bookings: {
          pending: pendingBookingsCount,
          completed: completedBookingsCount,
        },
        ads: adsCount,
        users: {
          user: usersCount,
          admin: adminsCount,
        },
      },
    });
  } catch (error) {
    logger.error("Error while fetching all counts ", error);
    next(
      new ErrorResponse(
        error,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = {
  chart,
};
