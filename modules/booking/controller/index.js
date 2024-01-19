const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const User = require("../../users/Model/user.model");
const Room = require("../Model");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");
const Booking = require("../Model");
const { Booking_type } = require("../helpers/constants");
const config = require("../../../common/config/configuration");
const stripe = require("stripe")(config.STRIPE_SECRET_KEY);

const findAllMyBooking = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginationService(page, size);
    const { _id: userId } = req.user;
    const myBooking = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "room")
      .limit(limit)
      .skip(skip);

    const totalCount = await Booking.countDocuments({ user: userId });

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
      .sort({ createdAt: -1 })
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
      message: "booking created successfully",
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

const pay = async (req, res, next) => {
  const { _id: bookingId } = req.params;
  const { _id: userId } = req.user;

  try {
    const { token: stripeToken } = req.body;

    // Check if valid bookingId
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(
        new ErrorResponse(
          `Invalid booking ID #_id: ${bookingId}`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Check if the userId from req.user is the same as the userId on the booking
    if (booking.user.toString() !== userId.toString()) {
      return next(
        new ErrorResponse(
          `Unauthorized to access this booking`,
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // Check if the booking is already paid
    if (booking.status === Booking_type.COMPLETED) {
      return next(
        new ErrorResponse(
          `This booking has already been paid`,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Get totalPrice from booking
    const { totalPrice } = booking;

    // Pay using Stripe
    const charge = await stripe.charges.create({
      amount: totalPrice * 100, // Stripe requires the amount to be in cents
      currency: "usd", // replace with your currency
      source: stripeToken, // obtained from the client-side Stripe.js
      description: `Charge for booking ID: ${bookingId}`,
    });

    // Check if payment success, update status of booking to be completed
    if (charge.status === "succeeded") {
      booking.status = Booking_type.COMPLETED;
      booking.stripeChargeId = charge.id;
      await booking.save();

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "booking payed successfully",
        data: { booking },
      });
    } else {
      logger.error("payment failed ");
      next(
        new ErrorResponse(`payment failed`, StatusCodes.INTERNAL_SERVER_ERROR)
      );
    }
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

module.exports = {
  findAll,
  findOne,
  create,
  deleteOne,
  updateOne,
  findAllMyBooking,
  pay,
};
