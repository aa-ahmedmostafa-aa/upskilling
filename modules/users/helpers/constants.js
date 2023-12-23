const endpoints = Object.freeze({
  USER_GET_ALL_USERS: "user:getAllUsers",
  USER_GET_USER: "user:getUser",
  USER_UPDATE_USER: "user:updateUser",
  USER_DELETE_USER: "user:deleteUser",
  USER_EXPORT_USERS: "user:exportUsers",
  USER_ASSIGN_ADMIN_GROUP: "user:assignAdminGroup",
  USER_CREATE_USER: "user:createUser",
});

const userTypes = Object.freeze({
  ADMIN: "admin",
  USER: "user",
});

module.exports = {
  endpoints,
  userTypes,
};
