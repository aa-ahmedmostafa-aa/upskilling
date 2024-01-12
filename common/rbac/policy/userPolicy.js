const {
  endpoints: UserEndPoints,
} = require("../../../modules/users/helpers/constants");

const {
  endpoints: BookingEndPoints,
} = require("../../../modules/booking/helpers/constants");

const {
  endpoints: RoomsEndPoints,
} = require("../../../modules/rooms/helpers/constants");

const {
  endpoints: AdsEndPoints,
} = require("../../../modules/ads/helpers/constants");

const {
  endpoints: FavoriteRoomsEndPoints,
} = require("../../../modules/favorite-rooms/helpers/constants");

const {
  endpoints: RoomCommentsEndPoints,
} = require("../../../modules/room-comments/helpers/constants");

const {
  endpoints: RoomReviewEndPoints,
} = require("../../../modules/room-reviews/helpers/constants");

module.exports = [
  UserEndPoints.USER_CHANGE_PASSWORD,
  UserEndPoints.USER_GET_USER,
  BookingEndPoints.BOOKING_MY_BOOKING,
  BookingEndPoints.BOOKING_DELETE_BOOKING,
  BookingEndPoints.BOOKING_CREATE_BOOKING,
  RoomsEndPoints.ROOM_GET_ALL_AVAILABLE_ROOMS,
  AdsEndPoints.ADS_GET_ALL,
  AdsEndPoints.ADS_GET_details,
  FavoriteRoomsEndPoints.FAVORITE_ROOMS_CREATE,
  FavoriteRoomsEndPoints.FAVORITE_ROOMS_GET_ALL,
  FavoriteRoomsEndPoints.FAVORITE_ROOMS_UPDATE,
  RoomCommentsEndPoints.ROOM_COMMENT_CREATE,
  RoomCommentsEndPoints.ROOM_COMMENT_DELETE,
  RoomCommentsEndPoints.ROOM_COMMENT_GET_ALL,
  RoomCommentsEndPoints.ROOM_COMMENT_UPDATE,
  RoomReviewEndPoints.ROOM_REVIEW_CREATE,
  RoomReviewEndPoints.ROOM_REVIEW_GET_ALL,
];
