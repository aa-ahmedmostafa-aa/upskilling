const nanoid = require("../../common/config/nanoId");

const id = () => nanoid(11, "0123456789");

module.exports = () => {
  return `id-${id()}`;
};
