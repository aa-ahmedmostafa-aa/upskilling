const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../../../common/utils/errorResponse");
const paginationService = require("../../../common/utils/paginationService");
const logger = require("../../../common/config/logger");
const Room = require("../../rooms/Model");
const FavoriteRooms = require("../Model");

const findAll = async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const { limit, skip } = paginationService(page, size);
    const { _id: userId } = req.user;

    const favoriteRooms = await FavoriteRooms.find({ user: userId })
      .populate("user", "userName")
      .populate("rooms")
      .limit(limit)
      .skip(skip);

    const totalCount = await FavoriteRooms.countDocuments({ user: userId });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "success",
      data: { favoriteRooms, totalCount },
    });
  } catch (error) {
    logger.error("Error while fetching your favorite rooms ", error);
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
    const { roomId } = req.body;
    const { _id: userId } = req.user;

    const room = await Room.findById(roomId);

    if (!room) {
      return next(
        new ErrorResponse(
          `Room not found with id: ${roomId}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    let favoriteRoom = await FavoriteRooms.findOne({ user: userId });

    if (favoriteRoom) {
      // If the room is already in the favorites, return an error
      if (favoriteRoom.rooms.includes(roomId)) {
        return next(
          new ErrorResponse(
            `Room is already in your favorite: ${roomId}`,
            StatusCodes.BAD_REQUEST
          )
        );
      }

      // Add the room to the favorites
      favoriteRoom.rooms.push(roomId);
    } else {
      // If the FavoriteRooms document does not exist, create it
      favoriteRoom = new FavoriteRooms({ user: userId, rooms: [roomId] });
    }

    await favoriteRoom.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Room added to favorites successfully",
      data: { favoriteRoom },
    });
  } catch (error) {
    logger.error("Error while adding room to favorites", error);
    next(
      new ErrorResponse(
        error.message,
        error.status || StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

// const updateOne = async (req, res, next) => {
//   const { rooms: roomIds } = req.body;
//   const { _id: userId } = req.user;

//   try {
//     // Check if every roomId exists
//     const rooms = await Room.find({
//       _id: { $in: roomIds },
//     });

//     if (rooms.length !== roomIds.length) {
//       return next(
//         new ErrorResponse(`Some rooms not found`, StatusCodes.NOT_FOUND)
//       );
//     }

//     // Find the FavoriteRooms document for the user
//     let favoriteRoom = await FavoriteRooms.findOne({ user: userId });

//     if (!favoriteRoom) {
//       return next(
//         new ErrorResponse(
//           `Favorite rooms not found for user: ${userId}`,
//           StatusCodes.NOT_FOUND
//         )
//       );
//     }

//     // Replace the existing rooms array with the new one
//     favoriteRoom.rooms = roomIds;

//     await favoriteRoom.save();

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Favorite rooms updated successfully",
//       data: { favoriteRoom },
//     });
//   } catch (error) {
//     logger.error("Error while updating favorite rooms", error);
//     next(
//       new ErrorResponse(
//         error.message,
//         error.status || StatusCodes.INTERNAL_SERVER_ERROR
//       )
//     );
//   }
// };

const removeOne = async (req, res, next) => {
  const { roomId } = req.params;
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

    // Find the FavoriteRooms document for the user
    let favoriteRoom = await FavoriteRooms.findOne({ user: userId });

    if (!favoriteRoom) {
      return next(
        new ErrorResponse(
          `Favorite rooms not found for user: ${userId}`,
          StatusCodes.NOT_FOUND
        )
      );
    }

    // Remove the room from the favorites
    favoriteRoom.rooms.pull(roomId);

    await favoriteRoom.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Room removed from favorites successfully",
      data: { favoriteRoom },
    });
  } catch (error) {
    logger.error("Error while removing room from favorites", error);
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
  create,
  removeOne,
  // updateOne,
};
