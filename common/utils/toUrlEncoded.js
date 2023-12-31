module.exports = function (object) {
  return Object.keys(object)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(object[key])
    )
    .join("&");
};
