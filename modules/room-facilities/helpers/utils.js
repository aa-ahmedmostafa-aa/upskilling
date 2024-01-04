const paginationService = require("../../../common/utils/paginationService");
const Booking = require("../../booking/Model");
const Room = require("../Model");

class Utils {
  static findAvailableRooms = async (
    page,
    size,
    startDate,
    endDate,
    capacity
  ) => {
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
    let roomQuery = {
      _id: { $nin: bookedRoomIds },
    };

    if (capacity) {
      roomQuery.capacity = capacity;
    }

    const rooms = await Room.find(roomQuery)
      .populate("createdBy", "userName")
      .limit(limit)
      .skip(skip);

    const totalCount = await Room.countDocuments(roomQuery);
    return { rooms, totalCount };
  };

  static findAllRoomsWithReservedFlag = async (page, size) => {
    const { limit, skip } = paginationService(page, size);
    // Fetch all rooms
    const rooms = await Room.find().limit(limit).skip(skip);

    // Find bookings in the date range
    const bookings = await Booking.find({});

    // Map of booked room IDs
    const bookedRoomIds = new Set(
      bookings.map((booking) => booking.room.toString())
    );

    // Flag rooms as booked or not
    const roomsWithBookingFlag = rooms.map((room) => ({
      ...room.toObject(),
      isBooked: bookedRoomIds.has(room._id.toString()),
    }));

    const totalCount = await Room.countDocuments();
    return { roomsWithBookingFlag, totalCount };
  };
}

module.exports = Utils;
